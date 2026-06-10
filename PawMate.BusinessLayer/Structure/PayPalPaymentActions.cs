using System.Globalization;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.Order;
using PawMate.Domain.Entities.Wallet;
using PawMate.Domain.Models.Payment;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Structure;

public class PayPalPaymentActions
{
    private static readonly HttpClient HttpClient = new();
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };
    private readonly PawMateDbContext _context;

    public PayPalPaymentActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse GetClientConfigAction()
    {
        if (!PayPalConfig.IsConfigured)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PayPal nu este configurat."
            };
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "Configurarea PayPal a fost obținută.",
            Data = new PayPalClientConfigDto
            {
                ClientId = PayPalConfig.ClientId,
                Currency = PayPalConfig.Currency
            }
        };
    }

    public async Task<ServiceResponse> CreateOrderActionAsync(int userId, PayPalCreateOrderDto request)
    {
        if (!PayPalConfig.IsConfigured)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PayPal nu este configurat."
            };
        }

        var normalizedItems = NormalizeItems(request);
        if (normalizedItems.Count == 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Coșul este gol sau conține produse invalide."
            };
        }

        OrderEntity? order = null;

        try
        {
            var productIds = normalizedItems.Select(item => item.ProductId).ToList();
            var products = await _context.MarketplaceListings
                .Where(product => productIds.Contains(product.Id))
                .ToDictionaryAsync(product => product.Id);

            if (products.Count != productIds.Count)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Unul sau mai multe produse din coș nu mai există."
                };
            }

            var totalAmount = normalizedItems.Sum(item => products[item.ProductId].Price * item.Quantity);
            if (totalAmount <= 0)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Totalul comenzii trebuie să fie mai mare decât 0."
                };
            }

            var paymentAmount = decimal.Round(
                totalAmount * PayPalConfig.MdlToPaymentCurrencyRate,
                2,
                MidpointRounding.AwayFromZero);

            order = new OrderEntity
            {
                UserId = userId,
                TotalAmount = totalAmount,
                PaymentAmount = paymentAmount,
                Currency = PayPalConfig.Currency,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                Items = normalizedItems.Select(item => new OrderItemEntity
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = products[item.ProductId].Price
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var accessToken = await GetAccessTokenAsync();
            var formattedAmount = paymentAmount.ToString("0.00", CultureInfo.InvariantCulture);

            var payload = new
            {
                intent = "CAPTURE",
                purchase_units = new[]
                {
                    new
                    {
                        reference_id = order.Id.ToString(CultureInfo.InvariantCulture),
                        description = $"PawMate order #{order.Id}",
                        amount = new
                        {
                            currency_code = PayPalConfig.Currency,
                            value = formattedAmount
                        }
                    }
                }
            };

            using var httpRequest = new HttpRequestMessage(
                HttpMethod.Post,
                $"{GetBaseUrl()}/v2/checkout/orders");
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            httpRequest.Content = JsonContent(payload);

            using var response = await HttpClient.SendAsync(httpRequest);
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                order.Status = "Failed";
                await _context.SaveChangesAsync();
                return PayPalErrorResponse("Nu s-a putut crea comanda PayPal.", content);
            }

            using var document = JsonDocument.Parse(content);
            var root = document.RootElement;
            var orderId = GetString(root, "id");
            var status = GetString(root, "status");
            var approveUrl = GetApproveUrl(root);

            order.PayPalOrderId = orderId;
            await _context.SaveChangesAsync();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Comanda PayPal a fost creată.",
                Data = new PayPalCreateOrderResultDto
                {
                    InternalOrderId = order.Id,
                    OrderId = orderId,
                    Status = status,
                    Currency = PayPalConfig.Currency,
                    TotalAmount = totalAmount,
                    Amount = paymentAmount,
                    ApproveUrl = approveUrl
                }
            };
        }
        catch (Exception ex)
        {
            if (order is { Id: > 0 } && order.Status == "Pending")
            {
                order.Status = "Failed";
                await _context.SaveChangesAsync();
            }

            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la crearea comenzii PayPal: {ex.Message}"
            };
        }
    }

    public async Task<ServiceResponse> CaptureOrderActionAsync(int userId, string orderId)
    {
        if (!PayPalConfig.IsConfigured)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PayPal nu este configurat."
            };
        }

        if (string.IsNullOrWhiteSpace(orderId))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Id-ul comenzii PayPal este obligatoriu."
            };
        }

        try
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(item => item.Product)
                .FirstOrDefaultAsync(o => o.PayPalOrderId == orderId);
            if (order == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Comanda locală pentru plata PayPal nu a fost găsită."
                };
            }

            if (order.UserId != userId)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Nu ai acces la această comandă."
                };
            }

            if (order.Status == "Paid")
            {
                await CreditSellerWalletsAsync(order);
                await _context.SaveChangesAsync();

                return new ServiceResponse
                {
                    IsSuccess = true,
                    Message = "Comanda este deja plătită.",
                    Data = new PayPalCaptureOrderResultDto
                    {
                        InternalOrderId = order.Id,
                        OrderId = orderId,
                        Status = "COMPLETED",
                        CaptureId = order.PayPalCaptureId,
                        CaptureStatus = "COMPLETED",
                        TotalAmount = order.TotalAmount,
                        Currency = order.Currency
                    }
                };
            }

            var accessToken = await GetAccessTokenAsync();

            using var httpRequest = new HttpRequestMessage(
                HttpMethod.Post,
                $"{GetBaseUrl()}/v2/checkout/orders/{Uri.EscapeDataString(orderId)}/capture");
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            httpRequest.Content = JsonContent(new { });

            using var response = await HttpClient.SendAsync(httpRequest);
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return PayPalErrorResponse("Nu s-a putut confirma plata PayPal.", content);
            }

            using var document = JsonDocument.Parse(content);
            var root = document.RootElement;
            var status = GetString(root, "status");
            var captureId = GetFirstCaptureValue(root, "id");
            var captureStatus = GetFirstCaptureValue(root, "status");
            var isCompleted = status == "COMPLETED" || captureStatus == "COMPLETED";

            await using var databaseTransaction = await _context.Database.BeginTransactionAsync();

            order.Status = isCompleted ? "Paid" : "Failed";
            order.PayPalCaptureId = captureId;
            order.PaidAt = isCompleted ? DateTime.UtcNow : null;

            if (isCompleted)
            {
                await CreditSellerWalletsAsync(order);
            }

            await _context.SaveChangesAsync();
            await databaseTransaction.CommitAsync();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Plata PayPal a fost confirmată.",
                Data = new PayPalCaptureOrderResultDto
                {
                    InternalOrderId = order.Id,
                    OrderId = orderId,
                    Status = status,
                    CaptureId = captureId,
                    CaptureStatus = captureStatus,
                    TotalAmount = order.TotalAmount,
                    Currency = order.Currency
                }
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la confirmarea plății PayPal: {ex.Message}"
            };
        }
    }

    private static List<PayPalCreateOrderItemDto> NormalizeItems(PayPalCreateOrderDto request)
    {
        return (request.Items ?? new List<PayPalCreateOrderItemDto>())
            .Where(item => item.ProductId > 0 && item.Quantity > 0)
            .GroupBy(item => item.ProductId)
            .Select(group => new PayPalCreateOrderItemDto
            {
                ProductId = group.Key,
                Quantity = group.Sum(item => item.Quantity)
            })
            .ToList();
    }

    private async Task CreditSellerWalletsAsync(OrderEntity order)
    {
        var sellerCredits = order.Items
            .Where(item => item.Product != null)
            .GroupBy(item => item.Product.SellerId)
            .Select(group => new
            {
                SellerId = group.Key,
                Amount = group.Sum(item => item.UnitPrice * item.Quantity)
            })
            .Where(credit => credit.Amount > 0)
            .ToList();

        if (sellerCredits.Count == 0)
        {
            return;
        }

        var creditedSellerIds = await _context.WalletTransactions
            .Where(transaction =>
                transaction.OrderId == order.Id &&
                transaction.Type == "sale_credit")
            .Select(transaction => transaction.SellerId)
            .ToListAsync();

        foreach (var credit in sellerCredits.Where(credit => !creditedSellerIds.Contains(credit.SellerId)))
        {
            var wallet = await _context.SellerWallets
                .FirstOrDefaultAsync(entry => entry.SellerId == credit.SellerId);

            if (wallet == null)
            {
                wallet = new SellerWalletEntity
                {
                    SellerId = credit.SellerId,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.SellerWallets.Add(wallet);
            }

            wallet.AvailableBalance += credit.Amount;
            wallet.TotalEarned += credit.Amount;
            wallet.UpdatedAt = DateTime.UtcNow;

            _context.WalletTransactions.Add(new WalletTransactionEntity
            {
                SellerId = credit.SellerId,
                OrderId = order.Id,
                Amount = credit.Amount,
                Type = "sale_credit",
                Description = $"Incasare sandbox din comanda #{order.Id}.",
                CreatedAt = DateTime.UtcNow
            });
        }
    }

    private static async Task<string> GetAccessTokenAsync()
    {
        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"{GetBaseUrl()}/v1/oauth2/token");

        var credentials = Convert.ToBase64String(
            Encoding.UTF8.GetBytes($"{PayPalConfig.ClientId}:{PayPalConfig.ClientSecret}"));

        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);
        request.Content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "client_credentials")
        });

        using var response = await HttpClient.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"PayPal access token failed: {content}");
        }

        using var document = JsonDocument.Parse(content);
        var token = GetString(document.RootElement, "access_token");

        if (string.IsNullOrWhiteSpace(token))
        {
            throw new InvalidOperationException("PayPal nu a returnat access_token.");
        }

        return token;
    }

    private static StringContent JsonContent(object payload)
    {
        return new StringContent(
            JsonSerializer.Serialize(payload, JsonOptions),
            Encoding.UTF8,
            "application/json");
    }

    private static string GetBaseUrl()
    {
        return PayPalConfig.BaseUrl.TrimEnd('/');
    }

    private static string GetString(JsonElement element, string propertyName)
    {
        return element.TryGetProperty(propertyName, out var value)
            ? value.GetString() ?? string.Empty
            : string.Empty;
    }

    private static string? GetApproveUrl(JsonElement root)
    {
        if (!root.TryGetProperty("links", out var links) || links.ValueKind != JsonValueKind.Array)
        {
            return null;
        }

        foreach (var link in links.EnumerateArray())
        {
            if (GetString(link, "rel") == "approve")
            {
                return GetString(link, "href");
            }
        }

        return null;
    }

    private static string? GetFirstCaptureValue(JsonElement root, string propertyName)
    {
        if (!root.TryGetProperty("purchase_units", out var purchaseUnits) ||
            purchaseUnits.ValueKind != JsonValueKind.Array)
        {
            return null;
        }

        foreach (var unit in purchaseUnits.EnumerateArray())
        {
            if (!unit.TryGetProperty("payments", out var payments) ||
                !payments.TryGetProperty("captures", out var captures) ||
                captures.ValueKind != JsonValueKind.Array)
            {
                continue;
            }

            foreach (var capture in captures.EnumerateArray())
            {
                return GetString(capture, propertyName);
            }
        }

        return null;
    }

    private static ServiceResponse PayPalErrorResponse(string message, string details)
    {
        return new ServiceResponse
        {
            IsSuccess = false,
            Message = $"{message} Detalii: {details}"
        };
    }
}
