using Microsoft.EntityFrameworkCore;
using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.Chat;
using PawMate.Domain.Models.Chat;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Structure;

public class ChatActions
{
    private readonly PawMateDbContext _context;

    public ChatActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse StartConversationAction(ChatStartDto dto, int userId)
    {
        try
        {
            if (dto.SitterId <= 0)
            {
                return Fail("Sitterul este obligatoriu.");
            }

            var sitter = _context.Sitters.FirstOrDefault(s => s.Id == dto.SitterId);
            if (sitter == null)
            {
                return Fail("Profilul sitter nu a fost gasit.");
            }

            if (!sitter.UserId.HasValue)
            {
                return Fail("Acest profil sitter nu are un cont asociat pentru chat.");
            }

            if (sitter.UserId.Value == userId)
            {
                return Fail("Nu poti porni o conversatie cu propriul profil sitter.");
            }

            var conversation = GetConversationQuery()
                .FirstOrDefault(c => c.ClientUserId == userId && c.SitterId == dto.SitterId);

            if (conversation == null)
            {
                var now = DateTime.UtcNow;
                conversation = new ChatConversationEntity
                {
                    ClientUserId = userId,
                    SitterId = dto.SitterId,
                    SitterUserId = sitter.UserId.Value,
                    CreatedAt = now,
                    LastMessageAt = now
                };

                _context.ChatConversations.Add(conversation);
                _context.SaveChanges();

                conversation = GetConversationQuery().First(c => c.Id == conversation.Id);
            }

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Conversatia este pregatita.",
                Data = ToConversationDto(conversation, userId)
            };
        }
        catch (Exception ex)
        {
            return Fail($"A aparut o eroare la pornirea conversatiei: {ex.Message}");
        }
    }

    public ServiceResponse GetConversationsAction(int userId)
    {
        try
        {
            var conversations = GetConversationQuery()
                .Where(c => c.ClientUserId == userId || c.SitterUserId == userId)
                .OrderByDescending(c => c.LastMessageAt)
                .AsEnumerable()
                .Select(c => ToConversationDto(c, userId))
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Conversatiile au fost incarcate.",
                Data = conversations
            };
        }
        catch (Exception ex)
        {
            return Fail($"A aparut o eroare la incarcarea conversatiilor: {ex.Message}");
        }
    }

    public ServiceResponse GetMessagesAction(int conversationId, int userId)
    {
        try
        {
            var conversation = _context.ChatConversations.FirstOrDefault(c => c.Id == conversationId);
            if (conversation == null)
            {
                return Fail("Conversatia nu a fost gasita.");
            }

            if (!CanAccessConversation(conversation, userId))
            {
                return Fail("Nu ai acces la aceasta conversatie.");
            }

            var messages = _context.ChatMessages
                .Include(m => m.SenderUser)
                .Where(m => m.ConversationId == conversationId)
                .OrderBy(m => m.CreatedAt)
                .AsEnumerable()
                .Select(m => ToMessageDto(m, userId))
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Mesajele au fost incarcate.",
                Data = messages
            };
        }
        catch (Exception ex)
        {
            return Fail($"A aparut o eroare la incarcarea mesajelor: {ex.Message}");
        }
    }

    public ServiceResponse SendMessageAction(int conversationId, ChatMessageCreateDto dto, int userId)
    {
        try
        {
            var body = dto.Body?.Trim() ?? string.Empty;
            if (string.IsNullOrWhiteSpace(body))
            {
                return Fail("Mesajul nu poate fi gol.");
            }

            if (body.Length > 2000)
            {
                return Fail("Mesajul poate avea maximum 2000 de caractere.");
            }

            var conversation = _context.ChatConversations.FirstOrDefault(c => c.Id == conversationId);
            if (conversation == null)
            {
                return Fail("Conversatia nu a fost gasita.");
            }

            if (!CanAccessConversation(conversation, userId))
            {
                return Fail("Nu ai acces la aceasta conversatie.");
            }

            var now = DateTime.UtcNow;
            var message = new ChatMessageEntity
            {
                ConversationId = conversationId,
                SenderUserId = userId,
                Body = body,
                CreatedAt = now
            };

            conversation.LastMessageAt = now;
            _context.ChatMessages.Add(message);
            _context.SaveChanges();

            var created = _context.ChatMessages
                .Include(m => m.SenderUser)
                .First(m => m.Id == message.Id);

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Mesajul a fost trimis.",
                Data = ToMessageDto(created, userId)
            };
        }
        catch (Exception ex)
        {
            return Fail($"A aparut o eroare la trimiterea mesajului: {ex.Message}");
        }
    }


    public ServiceResponse MarkConversationReadAction(int conversationId, int userId)
    {
        try
        {
            var conversation = _context.ChatConversations.FirstOrDefault(c => c.Id == conversationId);
            if (conversation == null)
            {
                return Fail("Conversatia nu a fost gasita.");
            }

            if (!CanAccessConversation(conversation, userId))
            {
                return Fail("Nu ai acces la aceasta conversatie.");
            }

            var now = DateTime.UtcNow;
            var unreadMessages = _context.ChatMessages
                .Where(m => m.ConversationId == conversationId && m.SenderUserId != userId && !m.ReadAt.HasValue)
                .ToList();

            foreach (var message in unreadMessages)
            {
                message.ReadAt = now;
            }

            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Conversatia a fost marcata ca citita.",
                Data = unreadMessages.Count
            };
        }
        catch (Exception ex)
        {
            return Fail($"A aparut o eroare la marcarea conversatiei ca citita: {ex.Message}");
        }
    }

    private IQueryable<ChatConversationEntity> GetConversationQuery()
    {
        return _context.ChatConversations
            .Include(c => c.ClientUser)
            .Include(c => c.SitterUser)
            .Include(c => c.Sitter)
            .Include(c => c.Messages);
    }

    private static bool CanAccessConversation(ChatConversationEntity conversation, int userId)
    {
        return conversation.ClientUserId == userId || conversation.SitterUserId == userId;
    }

    private static ChatConversationInfoDto ToConversationDto(ChatConversationEntity conversation, int currentUserId)
    {
        var lastMessage = conversation.Messages
            .OrderByDescending(m => m.CreatedAt)
            .FirstOrDefault();

        return new ChatConversationInfoDto
        {
            Id = conversation.Id,
            ClientUserId = conversation.ClientUserId,
            ClientName = conversation.ClientUser?.Name ?? string.Empty,
            SitterId = conversation.SitterId,
            SitterName = conversation.Sitter?.Name ?? string.Empty,
            SitterUserId = conversation.SitterUserId,
            SitterUserName = conversation.SitterUser?.Name ?? string.Empty,
            LastMessage = lastMessage?.Body ?? string.Empty,
            LastMessageAt = lastMessage?.CreatedAt ?? conversation.LastMessageAt,
            UnreadCount = conversation.Messages.Count(m => m.SenderUserId != currentUserId && !m.ReadAt.HasValue)
        };
    }

    private static ChatMessageInfoDto ToMessageDto(ChatMessageEntity message, int currentUserId) => new()
    {
        Id = message.Id,
        ConversationId = message.ConversationId,
        SenderUserId = message.SenderUserId,
        SenderName = message.SenderUser?.Name ?? string.Empty,
        Body = message.Body,
        CreatedAt = message.CreatedAt,
        IsMine = message.SenderUserId == currentUserId
    };

    private static ServiceResponse Fail(string message) => new()
    {
        IsSuccess = false,
        Message = message
    };
}