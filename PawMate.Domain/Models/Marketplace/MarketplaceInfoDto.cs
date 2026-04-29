namespace PawMate.Domain.Models.Marketplace;

public class MarketplaceInfoDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int SellerId { get; set; }
}
