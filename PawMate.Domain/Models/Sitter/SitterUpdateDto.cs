namespace PawMate.Domain.Models.Sitter;

public class SitterUpdateDto
{
    public string Name { get; set; }
    public string City { get; set; }
    public string Services { get; set; }
    public decimal PricePerDay { get; set; }
    public string Description { get; set; }
}