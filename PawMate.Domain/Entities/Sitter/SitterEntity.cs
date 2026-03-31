namespace PawMate.Domain.Entities.Sitter;

public class SitterEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string City { get; set; }
    public string Services { get; set; }
    public decimal PricePerDay { get; set; }
    public string Description { get; set; }
}
