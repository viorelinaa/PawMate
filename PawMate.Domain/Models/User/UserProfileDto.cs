using PawMate.Domain.Models.ProfileAvatar;
using PawMate.Domain.Models.Quiz;

namespace PawMate.Domain.Models.User;

public class UserProfileDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public ProfileAvatarInfoDto? SelectedAvatar { get; set; }
    public QuizResultInfoDto? LatestQuizResult { get; set; }
    public List<QuizResultInfoDto> QuizResults { get; set; } = new();
}
