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

    public ServiceResponse CreateSitterAction(SitterCreateDto sitter)
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
                Rating = 0
            };

            _context.Sitters.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Profilul sitter a fost adăugat cu succes.",
                Data = entity.Id
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la adăugarea profilului: {ex.Message}"
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
                    Message = "Profilul sitter nu a fost găsit."
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
                Rating = entity.Rating
            };

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Profilul sitter a fost găsit.",
                Data = dto
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea profilului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetSitterListAction()
    {
        try
        {
            var list = _context.Sitters
                .Select(s => new SitterInfoDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    City = s.City,
                    Services = s.Services,
                    PricePerDay = s.PricePerDay,
                    Description = s.Description,
                    Rating = s.Rating
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista sitter-ilor a fost obținută cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea listei de sitters: {ex.Message}"
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
                    Message = "Profilul sitter nu a fost găsit."
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
                Message = $"A apărut o eroare la actualizarea profilului: {ex.Message}"
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
                    Message = "Profilul sitter nu a fost găsit."
                };
            }

            _context.Sitters.Remove(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Profilul sitter a fost șters cu succes."
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la ștergerea profilului: {ex.Message}"
            };
        }
    }
}
