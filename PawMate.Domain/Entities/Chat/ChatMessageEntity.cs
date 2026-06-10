using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.Chat;

public class ChatMessageEntity
{
    public int Id { get; set; }
    public int ConversationId { get; set; }
    public int SenderUserId { get; set; }
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? ReadAt { get; set; }

    public ChatConversationEntity Conversation { get; set; } = null!;
    public UserEntity SenderUser { get; set; } = null!;
}