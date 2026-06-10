namespace PawMate.Domain.Models.Wallet;

public class WalletTransactionInfoDto
{
    public int Id { get; set; }
    public int? OrderId { get; set; }
    public int? WithdrawalRequestId { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
