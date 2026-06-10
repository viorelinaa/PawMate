using PawMate.Domain.Entities.User;
using PawMate.Domain.Entities.Order;

namespace PawMate.Domain.Entities.Marketplace;

public class MarketplaceEntity
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImagePublicId { get; set; }
    public int SellerId { get; set; }

    public UserEntity Seller { get; set; } = null!;
    public ICollection<OrderItemEntity> OrderItems { get; set; } = new List<OrderItemEntity>();
}
