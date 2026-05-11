namespace PawMate.Domain.Models.Pet;

public class PetQueryDto
{
    public string? Search { get; set; }
    public string? City { get; set; }
    public string? Species { get; set; }
    public string? Age { get; set; }
    public string? Size { get; set; }
    public bool OnlyVaccinated { get; set; }
    public bool OnlySterilized { get; set; }
    public string? SortBy { get; set; }
    public string? SortDirection { get; set; }
}
