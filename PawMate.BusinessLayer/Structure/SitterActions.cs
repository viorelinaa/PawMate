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
                _ => sittersQuery.OrderBy(s => s.Id)
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

    public ServiceResponse DeleteSitterAction(int id)
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
