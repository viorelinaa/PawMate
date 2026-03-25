using PawMate.Domain.Entities.Pet;
using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.Adoption;

public class AdoptionEntity
{
    public int Id { get; set; }
    public int PetId { get; set; }
    public int UserId { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }

    public PetEntity Pet { get; set; } = null!;
    public UserEntity User { get; set; } = null!;
}
