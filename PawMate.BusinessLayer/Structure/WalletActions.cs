using System.Data;
using System.Net.Mail;
using Microsoft.EntityFrameworkCore;
using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.Wallet;
using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.Wallet;

namespace PawMate.BusinessLayer.Structure;

public class WalletActions
{
    private static readonly HashSet<string> ValidDecisionStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        "approved",
        "rejected"
    };

    private readonly PawMateDbContext _context;

    public WalletActions()
    {
        _context = new PawMateDbContext();
    }

    public async Task<ServiceResponse> GetMyWalletActionAsync(int sellerId)
    {
        try
        {
            var wallet = await _context.SellerWallets
                .AsNoTracking()
                .FirstOrDefaultAsync(entry => entry.SellerId == sellerId);
            var payPalSandboxEmail = await _context.Users
                .AsNoTracking()
                .Where(user => user.Id == sellerId)
                .Select(user => user.PayPalSandboxEmail)
                .FirstOrDefaultAsync() ?? string.Empty;

            var transactions = await _context.WalletTransactions
                .AsNoTracking()
                .Where(transaction => transaction.SellerId == sellerId)
                .OrderByDescending(transaction => transaction.CreatedAt)
                .Take(50)
                .Select(transaction => new WalletTransactionInfoDto
                {
                    Id = transaction.Id,
                    OrderId = transaction.OrderId,
                    WithdrawalRequestId = transaction.WithdrawalRequestId,
                    Amount = transaction.Amount,
                    Type = transaction.Type,
                    Description = transaction.Description,
                    CreatedAt = transaction.CreatedAt
                })
                .ToListAsync();

            var withdrawalEntities = await _context.WithdrawalRequests
                .AsNoTracking()
                .Include(request => request.Seller)
                .Include(request => request.ProcessedByAdmin)
                .Where(request => request.SellerId == sellerId)
                .OrderByDescending(request => request.RequestedAt)
                .Take(50)
                .ToListAsync();
            var withdrawals = withdrawalEntities
                .Select(ToWithdrawalRequestInfoDto)
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Portmoneul a fost obtinut cu succes.",
                Data = new WalletSummaryDto
                {
                    PayPalSandboxEmail = payPalSandboxEmail,
                    AvailableBalance = wallet?.AvailableBalance ?? 0,
                    PendingWithdrawalBalance = wallet?.PendingWithdrawalBalance ?? 0,
                    TotalEarned = wallet?.TotalEarned ?? 0,
                    TotalWithdrawn = wallet?.TotalWithdrawn ?? 0,
                    Transactions = transactions,
                    Withdrawals = withdrawals
                }
            };
        }
        catch (Exception ex)
        {
            return Error($"A aparut o eroare la incarcarea portmoneului: {ex.Message}");
        }
    }

    public async Task<ServiceResponse> UpdatePayPalSandboxAccountActionAsync(
        int sellerId,
        PayPalSandboxAccountUpdateDto account)
    {
        var normalizedEmail = account.Email?.Trim().ToLowerInvariant() ?? string.Empty;
        if (normalizedEmail.Length > 0 && !IsValidEmail(normalizedEmail))
        {
            return Error("Introdu un email PayPal Sandbox valid.");
        }

        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(entry => entry.Id == sellerId);
            if (user == null)
            {
                return Error("Utilizatorul nu a fost gasit.");
            }

            user.PayPalSandboxEmail = normalizedEmail;
            await _context.SaveChangesAsync();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = normalizedEmail.Length > 0
                    ? "Contul PayPal Sandbox a fost salvat."
                    : "Contul PayPal Sandbox a fost eliminat.",
                Data = new PayPalSandboxAccountUpdateDto { Email = normalizedEmail }
            };
        }
        catch (Exception ex)
        {
            return Error($"A aparut o eroare la salvarea contului PayPal Sandbox: {ex.Message}");
        }
    }

    public async Task<ServiceResponse> CreateWithdrawalRequestActionAsync(
        int sellerId,
        WithdrawalRequestCreateDto request)
    {
        var amount = decimal.Round(request.Amount, 2, MidpointRounding.AwayFromZero);
        if (amount <= 0)
        {
            return Error("Suma retragerii trebuie sa fie mai mare decat 0.");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable);

        try
        {
            var seller = await _context.Users
                .FirstOrDefaultAsync(user => user.Id == sellerId);

            if (seller == null)
            {
                return Error("Utilizatorul nu a fost gasit.");
            }

            if (!IsValidEmail(seller.PayPalSandboxEmail))
            {
                return Error("Configureaza mai intai emailul PayPal Sandbox in portmoneu.");
            }

            var wallet = await _context.SellerWallets
                .FirstOrDefaultAsync(entry => entry.SellerId == sellerId);

            if (wallet == null || wallet.AvailableBalance < amount)
            {
                return Error("Soldul disponibil nu este suficient pentru aceasta retragere.");
            }

            wallet.AvailableBalance -= amount;
            wallet.PendingWithdrawalBalance += amount;
            wallet.UpdatedAt = DateTime.UtcNow;

            var withdrawalRequest = new WithdrawalRequestEntity
            {
                SellerId = sellerId,
                Amount = amount,
                DestinationPayPalEmail = seller.PayPalSandboxEmail,
                Status = "pending",
                AdminComment = string.Empty,
                RequestedAt = DateTime.UtcNow
            };

            _context.WithdrawalRequests.Add(withdrawalRequest);
            _context.WalletTransactions.Add(new WalletTransactionEntity
            {
                SellerId = sellerId,
                WithdrawalRequest = withdrawalRequest,
                Amount = -amount,
                Type = "withdrawal_request",
                Description = "Suma rezervata pentru o retragere sandbox.",
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Cererea de retragere sandbox a fost trimisa.",
                Data = ToWithdrawalRequestInfoDto(withdrawalRequest)
            };
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Error($"A aparut o eroare la crearea cererii de retragere: {ex.Message}");
        }
    }

    public async Task<ServiceResponse> GetWithdrawalRequestsForAdminActionAsync()
    {
        try
        {
            var requestEntities = await _context.WithdrawalRequests
                .AsNoTracking()
                .Include(request => request.Seller)
                .Include(request => request.ProcessedByAdmin)
                .OrderBy(request => request.Status == "pending" ? 0 : 1)
                .ThenByDescending(request => request.RequestedAt)
                .ToListAsync();
            var requests = requestEntities
                .Select(ToWithdrawalRequestInfoDto)
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Cererile de retragere au fost obtinute cu succes.",
                Data = requests
            };
        }
        catch (Exception ex)
        {
            return Error($"A aparut o eroare la incarcarea cererilor de retragere: {ex.Message}");
        }
    }

    public async Task<ServiceResponse> ReviewWithdrawalRequestActionAsync(
        int requestId,
        int adminId,
        WithdrawalRequestDecisionDto decision)
    {
        var status = decision.Status.Trim().ToLowerInvariant();
        var adminComment = decision.AdminComment.Trim();

        if (!ValidDecisionStatuses.Contains(status))
        {
            return Error("Statusul trebuie sa fie approved sau rejected.");
        }

        if (status == "rejected" && string.IsNullOrWhiteSpace(adminComment))
        {
            return Error("Comentariul este obligatoriu la respingerea retragerii.");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable);

        try
        {
            var withdrawalRequest = await _context.WithdrawalRequests
                .Include(request => request.Seller)
                .Include(request => request.ProcessedByAdmin)
                .FirstOrDefaultAsync(request => request.Id == requestId);

            if (withdrawalRequest == null)
            {
                return Error("Cererea de retragere nu a fost gasita.");
            }

            if (withdrawalRequest.Status != "pending")
            {
                return Error("Cererea de retragere a fost deja procesata.");
            }

            var wallet = await _context.SellerWallets
                .FirstOrDefaultAsync(entry => entry.SellerId == withdrawalRequest.SellerId);

            if (wallet == null || wallet.PendingWithdrawalBalance < withdrawalRequest.Amount)
            {
                return Error("Soldul rezervat pentru retragere este inconsistent.");
            }

            wallet.PendingWithdrawalBalance -= withdrawalRequest.Amount;
            wallet.UpdatedAt = DateTime.UtcNow;

            if (status == "approved")
            {
                wallet.TotalWithdrawn += withdrawalRequest.Amount;
            }
            else
            {
                wallet.AvailableBalance += withdrawalRequest.Amount;
                _context.WalletTransactions.Add(new WalletTransactionEntity
                {
                    SellerId = withdrawalRequest.SellerId,
                    WithdrawalRequestId = withdrawalRequest.Id,
                    Amount = withdrawalRequest.Amount,
                    Type = "withdrawal_refund",
                    Description = "Retragerea sandbox a fost respinsa, iar suma a revenit in sold.",
                    CreatedAt = DateTime.UtcNow
                });
            }

            withdrawalRequest.Status = status;
            withdrawalRequest.AdminComment = adminComment;
            withdrawalRequest.ProcessedAt = DateTime.UtcNow;
            withdrawalRequest.ProcessedByAdminId = adminId;

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            withdrawalRequest.ProcessedByAdmin = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(user => user.Id == adminId);

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = status == "approved"
                    ? "Retragerea sandbox a fost aprobata."
                    : "Retragerea sandbox a fost respinsa, iar suma a revenit in sold.",
                Data = ToWithdrawalRequestInfoDto(withdrawalRequest)
            };
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Error($"A aparut o eroare la procesarea retragerii: {ex.Message}");
        }
    }

    private static WithdrawalRequestInfoDto ToWithdrawalRequestInfoDto(WithdrawalRequestEntity request)
    {
        return new WithdrawalRequestInfoDto
        {
            Id = request.Id,
            SellerId = request.SellerId,
            SellerName = request.Seller?.Name ?? string.Empty,
            SellerEmail = request.Seller?.Email ?? string.Empty,
            DestinationPayPalEmail = request.DestinationPayPalEmail,
            Amount = request.Amount,
            Status = request.Status,
            AdminComment = request.AdminComment,
            RequestedAt = request.RequestedAt,
            ProcessedAt = request.ProcessedAt,
            ProcessedByAdminName = request.ProcessedByAdmin?.Name ?? string.Empty
        };
    }

    private static bool IsValidEmail(string email)
    {
        return !string.IsNullOrWhiteSpace(email) &&
               MailAddress.TryCreate(email, out var parsedAddress) &&
               string.Equals(parsedAddress.Address, email, StringComparison.OrdinalIgnoreCase);
    }

    private static ServiceResponse Error(string message)
    {
        return new ServiceResponse
        {
            IsSuccess = false,
            Message = message
        };
    }
}
