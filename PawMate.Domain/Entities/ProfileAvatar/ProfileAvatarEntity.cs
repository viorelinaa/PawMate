using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.ProfileAvatar;

public class ProfileAvatarEntity
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public ICollection<UserEntity> Users { get; set; } = new List<UserEntity>();
}
