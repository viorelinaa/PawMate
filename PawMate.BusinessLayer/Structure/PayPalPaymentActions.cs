using System.Globalization;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
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

    public async Task<ServiceResponse> CreateOrderActionAsync(PayPalCreateOrderDto request)
    {
        if (!PayPalConfig.IsConfigured)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PayPal nu este configurat."
            };
        }

        if (request.Amount <= 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Suma pentru plată trebuie să fie mai mare decât 0."
            };
        }

        try
        {
            var accessToken = await GetAccessTokenAsync();
            var amount = decimal.Round(
                request.Amount * PayPalConfig.MdlToPaymentCurrencyRate,
                2,
                MidpointRounding.AwayFromZero);
            var formattedAmount = amount.ToString("0.00", CultureInfo.InvariantCulture);

            var payload = new
            {
                intent = "CAPTURE",
                purchase_units = new[]
                {
                    new
                    {
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
                return PayPalErrorResponse("Nu s-a putut crea comanda PayPal.", content);
            }

            using var document = JsonDocument.Parse(content);
            var root = document.RootElement;
            var orderId = GetString(root, "id");
            var status = GetString(root, "status");
            var approveUrl = GetApproveUrl(root);

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Comanda PayPal a fost creată.",
                Data = new PayPalCreateOrderResultDto
                {
                    OrderId = orderId,
                    Status = status,
                    Currency = PayPalConfig.Currency,
                    Amount = amount,
                    ApproveUrl = approveUrl
                }
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la crearea comenzii PayPal: {ex.Message}"
            };
        }
    }

    public async Task<ServiceResponse> CaptureOrderActionAsync(string orderId)
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

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Plata PayPal a fost confirmată.",
                Data = new PayPalCaptureOrderResultDto
                {
                    OrderId = orderId,
                    Status = status,
                    CaptureId = captureId,
                    CaptureStatus = captureStatus
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
