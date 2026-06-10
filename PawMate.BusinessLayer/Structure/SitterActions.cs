using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.Sitter;
using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.Sitter;

namespace PawMate.BusinessLayer.Structure;

public class SitterActions
{
    private readonly PawMateDbContext _context;

    public SitterActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreateSitterAction(SitterCreateDto sitter, int userId)
    {
        try
        {
            var entity = new SitterEntity
            {
                Name = sitter.Name,
                City = sitter.City,
                Services = sitter.Services,
                PricePerDay = sitter.PricePerDay,
                Description = sitter.Description,
                Rating = 0,
                UserId = userId
            };

            _context.Sitters.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Profilul sitter a fost adaugat cu succes.",
                Data = entity.Id
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la adaugarea profilului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetSitterByIdAction(int id)
    {
        try
        {
            var entity = _context.Sitters.FirstOrDefault(s => s.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Profilul sitter nu a fost gasit."
                };
            }

            var dto = new SitterInfoDto
            {
                Id = entity.Id,
                Name = entity.Name,
                City = entity.City,
                Services = entity.Services,
                PricePerDay = entity.PricePerDay,
                Description = entity.Description,
                Rating = entity.Rating,
                RatingCount = _context.SitterRatings.Count(r => r.SitterId == entity.Id),
                UserId = entity.UserId
            };

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Profilul sitter a fost gasit.",
                Data = dto
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea profilului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetSitterListAction(SitterQueryDto query)
    {
        try
        {
            var sittersQuery = _context.Sitters.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var search = query.Search.Trim().ToLower();
                sittersQuery = sittersQuery.Where(s =>
                    s.Name.ToLower().Contains(search) ||
                    s.City.ToLower().Contains(search) ||
                    s.Services.ToLower().Contains(search) ||
                    s.Description.ToLower().Contains(search));
            }

            if (query.OnlyTopRated)
            {
                var minRating = query.MinRating ?? 4.7m;
                sittersQuery = sittersQuery.Where(s => s.Rating >= minRating);
            }

            sittersQuery = query.SortBy?.ToLower() switch
            {
                "price" when query.SortDirection == "desc" => sittersQuery.OrderByDescending(s => s.PricePerDay),
                "price" => sittersQuery.OrderBy(s => s.PricePerDay),
                "rating" when query.SortDirection == "asc" => sittersQuery.OrderBy(s => s.Rating),
                "rating" => sittersQuery.OrderByDescending(s => s.Rating),
                "name" when query.SortDirection == "desc" => sittersQuery.OrderByDescending(s => s.Name),
                "name" => sittersQuery.OrderBy(s => s.Name),
                _ => sittersQuery
                    .OrderByDescending(s => s.Rating)
                    .ThenByDescending(s => _context.SitterRatings.Count(r => r.SitterId == s.Id))
                    .ThenBy(s => s.Id)
            };

            var list = sittersQuery
                .Select(s => new SitterInfoDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    City = s.City,
                    Services = s.Services,
                    PricePerDay = s.PricePerDay,
                    Description = s.Description,
                    Rating = s.Rating,
                    RatingCount = _context.SitterRatings.Count(r => r.SitterId == s.Id),
                    UserId = s.UserId
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista sitter-ilor a fost obtinuta cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea listei de sitters: {ex.Message}"
            };
        }
    }

    public ServiceResponse UpdateSitterAction(int id, SitterUpdateDto sitter)
    {
        try
        {
            var entity = _context.Sitters.FirstOrDefault(s => s.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Profilul sitter nu a fost gasit."
                };
            }

            entity.Name = sitter.Name;
            entity.City = sitter.City;
            entity.Services = sitter.Services;
            entity.PricePerDay = sitter.PricePerDay;
            entity.Description = sitter.Description;
            entity.Rating = sitter.Rating;

            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Profilul sitter a fost actualizat cu succes."
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la actualizarea profilului: {ex.Message}"
            };
        }
    }


    public ServiceResponse RateSitterAction(int id, SitterRatingCreateDto rating, int userId)
    {
        try
        {
            if (rating.Rating < 1 || rating.Rating > 5)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Ratingul trebuie sa fie intre 1 si 5."
                };
            }
            var normalizedComment = rating.Comment?.Trim();
            if (normalizedComment?.Length > 700)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Comentariul poate avea maximum 700 de caractere."
                };
            }

            var sitter = _context.Sitters.FirstOrDefault(s => s.Id == id);
            if (sitter == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Profilul sitter nu a fost gasit."
                };
            }

            var now = DateTime.UtcNow;
            var existingRating = _context.SitterRatings.FirstOrDefault(r => r.SitterId == id && r.UserId == userId);

            if (existingRating == null)
            {
                existingRating = new SitterRatingEntity
                {
                    SitterId = id,
                    UserId = userId,
                    Rating = rating.Rating,
                    Comment = normalizedComment ?? string.Empty,
                    CreatedAt = now,
                    UpdatedAt = now
                };

                _context.SitterRatings.Add(existingRating);
            }
            else
            {
                existingRating.Rating = rating.Rating;
                if (rating.Comment != null)
                {
                    existingRating.Comment = normalizedComment ?? string.Empty;
                }
                existingRating.UpdatedAt = now;
            }

            _context.SaveChanges();

            var ratingValues = _context.SitterRatings
                .Where(r => r.SitterId == id)
                .Select(r => r.Rating)
                .ToList();

            sitter.Rating = ratingValues.Count == 0
                ? 0
                : Math.Round(ratingValues.Average(value => (decimal)value), 1);

            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Ratingul a fost salvat.",
                Data = new SitterRatingInfoDto
                {
                    SitterId = id,
                    Rating = sitter.Rating,
                    RatingCount = ratingValues.Count,
                    MyRating = existingRating.Rating,
                    Comment = existingRating.Comment
                }
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la salvarea ratingului: {ex.Message}"
            };
        }
    }
    public ServiceResponse GetSitterReviewsAction(int id)
    {
        try
        {
            var sitterExists = _context.Sitters.Any(s => s.Id == id);
            if (!sitterExists)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Profilul sitter nu a fost gasit."
                };
            }

            var reviews = _context.SitterRatings
                .Where(r => r.SitterId == id && (r.Rating > 0 || r.Comment != string.Empty))
                .OrderByDescending(r => r.UpdatedAt)
                .Select(r => new SitterReviewDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserName = r.User.Name,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Review-urile sitterului au fost obtinute.",
                Data = reviews
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea review-urilor: {ex.Message}"
            };
        }
    }

    public ServiceResponse DeleteSitterAction(int id, int userId, bool isAdmin)
    {
        try
        {
            var entity = _context.Sitters.FirstOrDefault(s => s.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Profilul sitter nu a fost gasit."
                };
            }

            if (!isAdmin && entity.UserId != userId)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Poti sterge doar propriul profil de sitter."
                };
            }

            var conversationIds = _context.ChatConversations
                .Where(c => c.SitterId == id)
                .Select(c => c.Id)
                .ToList();

            if (conversationIds.Count > 0)
            {
                var messages = _context.ChatMessages
                    .Where(m => conversationIds.Contains(m.ConversationId))
                    .ToList();
                _context.ChatMessages.RemoveRange(messages);

                var conversations = _context.ChatConversations
                    .Where(c => conversationIds.Contains(c.Id))
                    .ToList();
                _context.ChatConversations.RemoveRange(conversations);
            }

            var ratings = _context.SitterRatings
                .Where(r => r.SitterId == id)
                .ToList();
            _context.SitterRatings.RemoveRange(ratings);

            _context.Sitters.Remove(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Profilul sitter a fost sters cu succes."
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la stergerea profilului: {ex.Message}"
            };
        }
    }
}
