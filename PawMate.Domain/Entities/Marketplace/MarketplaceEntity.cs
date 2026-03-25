using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.Marketplace;

public class MarketplaceEntity
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int SellerId { get; set; }

    public UserEntity Seller { get; set; } = null!;
}
