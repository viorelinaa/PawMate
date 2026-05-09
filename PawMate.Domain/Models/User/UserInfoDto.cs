using PawMate.Domain.Models.ProfileAvatar;

namespace PawMate.Domain.Models.User;

public class UserInfoDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public string Status { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public DateTime? LastActiveAt { get; set; }
    public int LoginCount { get; set; }
    public bool IsEmailVerified { get; set; }
    public bool HasPhone { get; set; }
    public bool HasCity { get; set; }
    public int BlogPostsCount { get; set; }
    public int? PetsAddedCount { get; set; }
    public int? LostPetsPublishedCount { get; set; }
    public int AdoptionRequestsCount { get; set; }
    public DateTime? LastActivityAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public ProfileAvatarInfoDto? SelectedAvatar { get; set; }
}
