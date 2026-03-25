using PawMate.Domain.Entities.Pet;
using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.LostPet;

public class LostPetEntity
{
    public int Id { get; set; }
    public int PetId { get; set; }
    public int UserId { get; set; }
    public string Location { get; set; }
    public DateTime LostDate { get; set; }
    public bool IsFound { get; set; }

    public PetEntity Pet { get; set; } = null!;
    public UserEntity User { get; set; } = null!;
}
