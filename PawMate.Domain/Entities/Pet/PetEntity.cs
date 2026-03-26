using PawMate.Domain.Entities.Adoption;
using PawMate.Domain.Entities.LostPet;

namespace PawMate.Domain.Entities.Pet;

public class PetEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Species { get; set; }
    public string City { get; set; }
    public string Age { get; set; }
    public string Size { get; set; }
    public bool Vaccinated { get; set; }
    public bool Sterilized { get; set; }
    public string Description { get; set; }

    public ICollection<AdoptionEntity> Adoptions { get; set; } = new List<AdoptionEntity>();
    public ICollection<LostPetEntity> LostPets { get; set; } = new List<LostPetEntity>();
}
