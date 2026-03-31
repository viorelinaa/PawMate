namespace PawMate.Domain.Models.Sitter;

public class SitterCreateDto
{
    public string Name { get; set; }
    public string City { get; set; }
    public string Services { get; set; }
    public decimal PricePerDay { get; set; }
    public string Description { get; set; }
}