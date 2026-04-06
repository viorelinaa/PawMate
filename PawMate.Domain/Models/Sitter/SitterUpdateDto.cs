namespace PawMate.Domain.Models.Sitter;

public class SitterUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Services { get; set; } = string.Empty;
    public decimal PricePerDay { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Rating { get; set; }
}
