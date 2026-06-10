using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.Volunteer;

public class VolunteerApplicationEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Experience { get; set; } = string.Empty;
    public string Availability { get; set; } = string.Empty;
    public string Activities { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = "pending";
    public string AdminComment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public int? ReviewedByAdminId { get; set; }

    public UserEntity User { get; set; } = null!;
    public UserEntity? ReviewedByAdmin { get; set; }
}
