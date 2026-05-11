namespace PawMate.Domain.Models.VeterinaryClinic;

public class VeterinaryClinicQueryDto
{
    public string? Search { get; set; }
    public string? City { get; set; }
    public bool OnlyEmergency { get; set; }
    public string? SortBy { get; set; }
    public string? SortDirection { get; set; }
}
