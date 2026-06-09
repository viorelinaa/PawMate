namespace PawMate.Domain.Models.Adoption;

public class AdoptionInfoDto
{
    public int Id { get; set; }
    public int PetId { get; set; }
    public int UserId { get; set; }
    public int? OwnerUserId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string ApplicantName { get; set; } = string.Empty;
    public string ApplicantPhone { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string AnimalExperience { get; set; } = string.Empty;
    public string LivingConditions { get; set; } = string.Empty;
    public string ApplicantUserName { get; set; } = string.Empty;
    public string ApplicantEmail { get; set; } = string.Empty;
    public string PetName { get; set; } = string.Empty;
    public string PetSpecies { get; set; } = string.Empty;
    public string PetCity { get; set; } = string.Empty;
    public string? PetImageUrl { get; set; }
}