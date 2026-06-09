using PawMate.Domain.Entities.Sitter;
using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.Chat;

public class ChatConversationEntity
{
    public int Id { get; set; }
    public int ClientUserId { get; set; }
    public int SitterId { get; set; }
    public int SitterUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastMessageAt { get; set; }

    public UserEntity ClientUser { get; set; } = null!;
    public UserEntity SitterUser { get; set; } = null!;
    public SitterEntity Sitter { get; set; } = null!;
    public ICollection<ChatMessageEntity> Messages { get; set; } = new List<ChatMessageEntity>();
}