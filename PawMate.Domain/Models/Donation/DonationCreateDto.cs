namespace PawMate.Domain.Models.Donation;

public class DonationCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string DonationLink { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
