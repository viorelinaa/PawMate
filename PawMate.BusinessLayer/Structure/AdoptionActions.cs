using Microsoft.EntityFrameworkCore;
using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.Adoption;
using PawMate.Domain.Models.Adoption;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Structure;

public class AdoptionActions
{
    private readonly PawMateDbContext _context;

    public AdoptionActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreateAdoptionAction(AdoptionCreateDto adoption)
    {
        try
        {
            var entity = new AdoptionEntity
            {
                PetId = adoption.PetId,
                UserId = adoption.UserId,
                Status = "pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Adoptions.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Cererea de adopție a fost trimisă cu succes.",
                Data = entity.Id
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la crearea cererii de adopție: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetAdoptionByIdAction(int id)
    {
        try
        {
            var entity = _context.Adoptions.FirstOrDefault(a => a.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Cererea de adopție nu a fost găsită."
                };
            }

            var dto = new AdoptionInfoDto
            {
                Id = entity.Id,
                PetId = entity.PetId,
                UserId = entity.UserId,
                Status = entity.Status,
                CreatedAt = entity.CreatedAt
            };

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Cererea de adopție a fost găsită.",
                Data = dto
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea cererii de adopție: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetAdoptionListAction()
    {
        try
        {
            var list = _context.Adoptions
                .Select(a => new AdoptionInfoDto
                {
                    Id = a.Id,
                    PetId = a.PetId,
                    UserId = a.UserId,
                    Status = a.Status,
                    CreatedAt = a.CreatedAt
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista cererilor de adopție a fost obținută cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea listei de adopții: {ex.Message}"
            };
        }
    }
}
