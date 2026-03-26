namespace PawMate.Domain.Models.Pet;

public class PetUpdateDto
{
    public string Name { get; set; }
    public string Species { get; set; }
    public string City { get; set; }
    public string Age { get; set; }
    public string Size { get; set; }
    public bool Vaccinated { get; set; }
    public bool Sterilized { get; set; }
    public string Description { get; set; }
}
