using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.Wallet;

namespace PawMate.BusinessLayer.Interfaces;

public interface IWalletLogic
{
    Task<ServiceResponse> GetMyWalletAsync(int sellerId);
    Task<ServiceResponse> UpdatePayPalSandboxAccountAsync(int sellerId, PayPalSandboxAccountUpdateDto account);
    Task<ServiceResponse> CreateWithdrawalRequestAsync(int sellerId, WithdrawalRequestCreateDto request);
    Task<ServiceResponse> GetWithdrawalRequestsForAdminAsync();
    Task<ServiceResponse> ReviewWithdrawalRequestAsync(
        int requestId,
        int adminId,
        WithdrawalRequestDecisionDto decision);
}
