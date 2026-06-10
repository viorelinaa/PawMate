using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.Wallet;

public class SellerWalletEntity
{
    public int Id { get; set; }
    public int SellerId { get; set; }
    public decimal AvailableBalance { get; set; }
    public decimal PendingWithdrawalBalance { get; set; }
    public decimal TotalEarned { get; set; }
    public decimal TotalWithdrawn { get; set; }
    public DateTime UpdatedAt { get; set; }

    public UserEntity Seller { get; set; } = null!;
}
