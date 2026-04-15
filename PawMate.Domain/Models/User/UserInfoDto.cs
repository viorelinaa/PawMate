using PawMate.Domain.Models.ProfileAvatar;

namespace PawMate.Domain.Models.User;

public class UserInfoDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public ProfileAvatarInfoDto? SelectedAvatar { get; set; }
}
