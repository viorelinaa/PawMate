using PawMate.Domain.Models.Chat;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IChatLogic
{
    ServiceResponse StartConversation(ChatStartDto dto, int userId);
    ServiceResponse GetConversations(int userId);
    ServiceResponse GetMessages(int conversationId, int userId);
    ServiceResponse SendMessage(int conversationId, ChatMessageCreateDto dto, int userId);
}