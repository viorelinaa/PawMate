using PawMate.Domain.Entities.Chat;
using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.Sitter;

public class SitterEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Services { get; set; } = string.Empty;
    public decimal PricePerDay { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Rating { get; set; } = 0;
    public int? UserId { get; set; }

    public UserEntity? User { get; set; }
    public ICollection<ChatConversationEntity> ChatConversations { get; set; } = new List<ChatConversationEntity>();
    public ICollection<SitterRatingEntity> Ratings { get; set; } = new List<SitterRatingEntity>();
}
