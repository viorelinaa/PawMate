namespace PawMate.Domain.Models.Adoption;

public class AdoptionInfoDto
{
    public int Id { get; set; }
    public int PetId { get; set; }
    public int UserId { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
