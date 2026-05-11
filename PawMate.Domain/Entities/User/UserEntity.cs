using PawMate.Domain.Entities.Adoption;
using PawMate.Domain.Entities.BlogPost;
using PawMate.Domain.Entities.Marketplace;
using PawMate.Domain.Entities.Pet;
using PawMate.Domain.Entities.ProfileAvatar;
using PawMate.Domain.Entities.QuizResult;
using PawMate.Domain.Entities.RefreshToken;

namespace PawMate.Domain.Entities.User;

public class UserEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? LastLoginAt { get; set; }
    public DateTime? LastActiveAt { get; set; }
    public int LoginCount { get; set; }
    public bool IsEmailVerified { get; set; }

    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int? ProfileAvatarId { get; set; }
    public DateTime CreatedAt { get; set; }

    public ProfileAvatarEntity? ProfileAvatar { get; set; }

    public ICollection<AdoptionEntity> Adoptions { get; set; } = new List<AdoptionEntity>();
    public ICollection<PetEntity> Pets { get; set; } = new List<PetEntity>();
    public ICollection<BlogPostEntity> BlogPosts { get; set; } = new List<BlogPostEntity>();
    public ICollection<MarketplaceEntity> MarketplaceListings { get; set; } = new List<MarketplaceEntity>();
    public ICollection<QuizResultEntity> QuizResults { get; set; } = new List<QuizResultEntity>();
    public ICollection<RefreshTokenEntity> RefreshTokens { get; set; } = new List<RefreshTokenEntity>();
}
