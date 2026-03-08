namespace PawMate.Domain.Models.Marketplace;

public class MarketplaceCreateDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int SellerId { get; set; }
}
