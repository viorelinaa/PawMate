namespace PawMate.Domain.Models.Volunteer;

public class VolunteerCreateDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string Location { get; set; }
    public DateTime Date { get; set; }
}
