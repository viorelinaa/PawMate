namespace PawMate.Domain.Models.Adoption;

public class AdoptionCreateDto
{
    public int PetId { get; set; }
    public string ApplicantName { get; set; } = string.Empty;
    public string ApplicantPhone { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string AnimalExperience { get; set; } = string.Empty;
    public string LivingConditions { get; set; } = string.Empty;
}