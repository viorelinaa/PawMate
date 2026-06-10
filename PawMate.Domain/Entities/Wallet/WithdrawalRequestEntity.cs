using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.Wallet;

public class WithdrawalRequestEntity
{
    public int Id { get; set; }
    public int SellerId { get; set; }
    public decimal Amount { get; set; }
    public string DestinationPayPalEmail { get; set; } = string.Empty;
    public string Status { get; set; } = "pending";
    public string AdminComment { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public int? ProcessedByAdminId { get; set; }

    public UserEntity Seller { get; set; } = null!;
    public UserEntity? ProcessedByAdmin { get; set; }
    public ICollection<WalletTransactionEntity> Transactions { get; set; } = new List<WalletTransactionEntity>();
}
