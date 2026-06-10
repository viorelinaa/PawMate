using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.Sitter;

public class SitterRatingEntity
{
    public int Id { get; set; }
    public int SitterId { get; set; }
    public int UserId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public SitterEntity Sitter { get; set; } = null!;
    public UserEntity User { get; set; } = null!;
}