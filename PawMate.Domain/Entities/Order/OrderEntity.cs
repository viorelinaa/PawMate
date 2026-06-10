using PawMate.Domain.Entities.User;
using PawMate.Domain.Entities.Wallet;

namespace PawMate.Domain.Entities.Order;

public class OrderEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaymentAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public string? PayPalOrderId { get; set; }
    public string? PayPalCaptureId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? PaidAt { get; set; }

    public UserEntity User { get; set; } = null!;
    public ICollection<OrderItemEntity> Items { get; set; } = new List<OrderItemEntity>();
    public ICollection<WalletTransactionEntity> WalletTransactions { get; set; } = new List<WalletTransactionEntity>();
}
