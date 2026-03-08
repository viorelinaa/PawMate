namespace PawMate.Domain.Models.LostPet;

public class LostPetCreateDto
{
    public int PetId { get; set; }
    public int UserId { get; set; }
    public string Location { get; set; }
    public DateTime LostDate { get; set; }
}
