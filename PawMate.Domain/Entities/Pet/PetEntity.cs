using PawMate.Domain.Entities.Adoption;
using PawMate.Domain.Entities.LostPet;

namespace PawMate.Domain.Entities.Pet;

public class PetEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Species { get; set; }
    public string Breed { get; set; }
    public int Age { get; set; }
    public string Gender { get; set; }
    public string Description { get; set; }

    public ICollection<AdoptionEntity> Adoptions { get; set; } = new List<AdoptionEntity>();
    public ICollection<LostPetEntity> LostPets { get; set; } = new List<LostPetEntity>();
}
