using Microsoft.EntityFrameworkCore;
using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.LostPet;
using PawMate.Domain.Models.LostPet;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Structure;

public class LostPetActions
{
    private readonly PawMateDbContext _context;

    public LostPetActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreateLostPetAction(LostPetCreateDto lostPet)
    {
        try
        {
            var entity = new LostPetEntity
            {
                PetId = lostPet.PetId,
                UserId = lostPet.UserId,
                Location = lostPet.Location,
                LostDate = lostPet.LostDate,
                IsFound = false
            };

            _context.LostPets.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Anunțul pentru animalul pierdut a fost creat cu succes.",
                Data = entity.Id
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la crearea anunțului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetLostPetByIdAction(int id)
    {
        try
        {
            var entity = _context.LostPets.FirstOrDefault(lp => lp.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Anunțul pentru animalul pierdut nu a fost găsit."
                };
            }

            var dto = new LostPetInfoDto
            {
                Id = entity.Id,
                PetId = entity.PetId,
                UserId = entity.UserId,
                Location = entity.Location,
                LostDate = entity.LostDate,
                IsFound = entity.IsFound
            };

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Anunțul pentru animalul pierdut a fost găsit.",
                Data = dto
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea anunțului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetLostPetListAction()
    {
        try
        {
            var list = _context.LostPets
                .Select(lp => new LostPetInfoDto
                {
                    Id = lp.Id,
                    PetId = lp.PetId,
                    UserId = lp.UserId,
                    Location = lp.Location,
                    LostDate = lp.LostDate,
                    IsFound = lp.IsFound
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista animalelor pierdute a fost obținută cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea listei de animale pierdute: {ex.Message}"
            };
        }
    }
}
