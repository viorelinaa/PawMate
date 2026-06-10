using PawMate.Domain.Entities.Order;
using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.Wallet;

public class WalletTransactionEntity
{
    public int Id { get; set; }
    public int SellerId { get; set; }
    public int? OrderId { get; set; }
    public int? WithdrawalRequestId { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public UserEntity Seller { get; set; } = null!;
    public OrderEntity? Order { get; set; }
    public WithdrawalRequestEntity? WithdrawalRequest { get; set; }
}
