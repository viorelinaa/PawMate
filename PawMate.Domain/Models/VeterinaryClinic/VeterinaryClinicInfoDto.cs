namespace PawMate.Domain.Models.VeterinaryClinic;

public class VeterinaryClinicInfoDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string[] Services { get; set; } = [];
    public bool Emergency { get; set; }
    public string Description { get; set; } = string.Empty;
    public string GoogleMapsUrl { get; set; } = string.Empty;
    public string AppleMapsUrl { get; set; } = string.Empty;
    public string MapEmbedUrl { get; set; } = string.Empty;
}
