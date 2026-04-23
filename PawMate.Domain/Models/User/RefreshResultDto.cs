namespace PawMate.Domain.Models.User;

public class RefreshResultDto
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}
