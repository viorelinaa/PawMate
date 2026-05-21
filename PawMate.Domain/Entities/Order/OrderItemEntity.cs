using PawMate.Domain.Entities.Marketplace;

namespace PawMate.Domain.Entities.Order;

public class OrderItemEntity
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }

    public OrderEntity Order { get; set; } = null!;
    public MarketplaceEntity Product { get; set; } = null!;
}
