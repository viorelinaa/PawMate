namespace PawMate.Domain.Models.Chat;

public class ChatConversationInfoDto
{
    public int Id { get; set; }
    public int ClientUserId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public int SitterId { get; set; }
    public string SitterName { get; set; } = string.Empty;
    public int SitterUserId { get; set; }
    public string SitterUserName { get; set; } = string.Empty;
    public string LastMessage { get; set; } = string.Empty;
    public DateTime LastMessageAt { get; set; }
    public int UnreadCount { get; set; }
}