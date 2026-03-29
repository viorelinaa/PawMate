namespace PawMate.Domain.Entities.LostPet;

public class LostPetEntity
{
    public int Id { get; set; }
    public string Species { get; set; }
    public string City { get; set; }
    public DateTime LostDate { get; set; }
    public string Contact { get; set; }
    public string Description { get; set; }
    public bool IsFound { get; set; }
}
