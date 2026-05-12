namespace PawMate.Domain.Models.LostPet;

public class LostPetQueryDto
{
    public string? Search { get; set; }
    public string? Species { get; set; }
    public string? City { get; set; }
    public bool? IsFound { get; set; }
    public string? SortBy { get; set; }
    public string? SortDirection { get; set; }
}
