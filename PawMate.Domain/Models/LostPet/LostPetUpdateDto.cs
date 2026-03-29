namespace PawMate.Domain.Models.LostPet;

public class LostPetUpdateDto
{
    public string Species { get; set; }
    public string City { get; set; }
    public string LostDate { get; set; }
    public string Contact { get; set; }
    public string Description { get; set; }
    public bool IsFound { get; set; }
}
