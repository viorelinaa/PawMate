namespace PawMate.Domain.Entities.Donation;

public class DonationEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string DonationLink { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
