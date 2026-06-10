using PawMate.Domain.Entities.Adoption;
using PawMate.Domain.Entities.User;

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
    public string? OwnerContact { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImagePublicId { get; set; }
    public int? UserId { get; set; }

    public UserEntity? User { get; set; }
    public ICollection<AdoptionEntity> Adoptions { get; set; } = new List<AdoptionEntity>();
}
