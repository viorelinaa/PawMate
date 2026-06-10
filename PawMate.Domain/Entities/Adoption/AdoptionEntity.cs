using PawMate.Domain.Entities.Pet;
using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.Adoption;

public class AdoptionEntity
{
    public int Id { get; set; }
    public int PetId { get; set; }
    public int UserId { get; set; }
    public string Status { get; set; } = "pending";
    public DateTime CreatedAt { get; set; }
    public string ApplicantName { get; set; } = string.Empty;
    public string ApplicantPhone { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string AnimalExperience { get; set; } = string.Empty;
    public string LivingConditions { get; set; } = string.Empty;
    public DateTime? ReviewedAt { get; set; }

    public PetEntity Pet { get; set; } = null!;
    public UserEntity User { get; set; } = null!;
}