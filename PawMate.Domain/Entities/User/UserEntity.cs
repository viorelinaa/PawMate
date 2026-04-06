using PawMate.Domain.Entities.Adoption;
using PawMate.Domain.Entities.BlogPost;
using PawMate.Domain.Entities.Marketplace;

namespace PawMate.Domain.Entities.User;

public class UserEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public ICollection<AdoptionEntity> Adoptions { get; set; } = new List<AdoptionEntity>();
    public ICollection<BlogPostEntity> BlogPosts { get; set; } = new List<BlogPostEntity>();
    public ICollection<MarketplaceEntity> MarketplaceListings { get; set; } = new List<MarketplaceEntity>();
}
