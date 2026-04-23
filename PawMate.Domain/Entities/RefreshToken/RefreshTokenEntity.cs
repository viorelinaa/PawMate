using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.RefreshToken;

public class RefreshTokenEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime CreatedAt { get; set; }

    public UserEntity User { get; set; } = null!;
}
