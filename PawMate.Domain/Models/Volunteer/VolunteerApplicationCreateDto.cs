namespace PawMate.Domain.Models.Volunteer;

public class VolunteerApplicationCreateDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Experience { get; set; } = string.Empty;
    public string Availability { get; set; } = string.Empty;
    public List<string> Activities { get; set; } = new();
    public string Message { get; set; } = string.Empty;
}
