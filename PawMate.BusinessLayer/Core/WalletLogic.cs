using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.Wallet;

namespace PawMate.BusinessLayer.Core;

public class WalletLogic : WalletActions, IWalletLogic
{
    public Task<ServiceResponse> GetMyWalletAsync(int sellerId)
    {
        return GetMyWalletActionAsync(sellerId);
    }

    public Task<ServiceResponse> UpdatePayPalSandboxAccountAsync(
        int sellerId,
        PayPalSandboxAccountUpdateDto account)
    {
        return UpdatePayPalSandboxAccountActionAsync(sellerId, account);
    }

    public Task<ServiceResponse> CreateWithdrawalRequestAsync(int sellerId, WithdrawalRequestCreateDto request)
    {
        return CreateWithdrawalRequestActionAsync(sellerId, request);
    }

    public Task<ServiceResponse> GetWithdrawalRequestsForAdminAsync()
    {
        return GetWithdrawalRequestsForAdminActionAsync();
    }

    public Task<ServiceResponse> ReviewWithdrawalRequestAsync(
        int requestId,
        int adminId,
        WithdrawalRequestDecisionDto decision)
    {
        return ReviewWithdrawalRequestActionAsync(requestId, adminId, decision);
    }
}
