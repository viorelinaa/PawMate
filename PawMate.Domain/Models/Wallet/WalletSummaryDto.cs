namespace PawMate.Domain.Models.Wallet;

public class WalletSummaryDto
{
    public string PayPalSandboxEmail { get; set; } = string.Empty;
    public decimal AvailableBalance { get; set; }
    public decimal PendingWithdrawalBalance { get; set; }
    public decimal TotalEarned { get; set; }
    public decimal TotalWithdrawn { get; set; }
    public List<WalletTransactionInfoDto> Transactions { get; set; } = new();
    public List<WithdrawalRequestInfoDto> Withdrawals { get; set; } = new();
}
