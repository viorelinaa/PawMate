namespace PawMate.Domain.Models.Marketplace;

public class MarketplaceQueryDto
{
    public string? Search { get; set; }
    public string? Category { get; set; }
    public string? SortBy { get; set; }
    public string? SortDirection { get; set; }
}
