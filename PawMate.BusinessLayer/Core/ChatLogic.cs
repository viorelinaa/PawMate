using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Chat;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Core;

public class ChatLogic : ChatActions, IChatLogic
{
    public ServiceResponse StartConversation(ChatStartDto dto, int userId) => StartConversationAction(dto, userId);
    public ServiceResponse GetConversations(int userId) => GetConversationsAction(userId);
    public ServiceResponse GetMessages(int conversationId, int userId) => GetMessagesAction(conversationId, userId);
    public ServiceResponse SendMessage(int conversationId, ChatMessageCreateDto dto, int userId) => SendMessageAction(conversationId, dto, userId);
}