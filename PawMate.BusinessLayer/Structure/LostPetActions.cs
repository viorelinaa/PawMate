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
                Species = lostPet.Species,
                City = lostPet.City,
                LostDate = DateTime.SpecifyKind(DateTime.Parse(lostPet.LostDate), DateTimeKind.Utc),
                Contact = lostPet.Contact,
                Description = lostPet.Description,
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
                return new ServiceResponse { IsSuccess = false, Message = "Anunțul nu a fost găsit." };

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Anunțul a fost găsit.",
                Data = ToDto(entity)
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare: {ex.Message}" };
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
                    Species = lp.Species,
                    City = lp.City,
                    LostDate = lp.LostDate.ToString("yyyy-MM-dd"),
                    Contact = lp.Contact,
                    Description = lp.Description,
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
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare: {ex.Message}" };
        }
    }

    public ServiceResponse UpdateLostPetAction(int id, LostPetUpdateDto lostPet)
    {
        try
        {
            var entity = _context.LostPets.FirstOrDefault(lp => lp.Id == id);

            if (entity == null)
                return new ServiceResponse { IsSuccess = false, Message = "Anunțul nu a fost găsit." };

            entity.Species = lostPet.Species;
            entity.City = lostPet.City;
            entity.LostDate = DateTime.SpecifyKind(DateTime.Parse(lostPet.LostDate), DateTimeKind.Utc);
            entity.Contact = lostPet.Contact;
            entity.Description = lostPet.Description;
            entity.IsFound = lostPet.IsFound;

            _context.SaveChanges();

            return new ServiceResponse { IsSuccess = true, Message = "Anunțul a fost actualizat cu succes." };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare: {ex.Message}" };
        }
    }

    public ServiceResponse DeleteLostPetAction(int id)
    {
        try
        {
            var entity = _context.LostPets.FirstOrDefault(lp => lp.Id == id);

            if (entity == null)
                return new ServiceResponse { IsSuccess = false, Message = "Anunțul nu a fost găsit." };

            _context.LostPets.Remove(entity);
            _context.SaveChanges();

            return new ServiceResponse { IsSuccess = true, Message = "Anunțul a fost șters cu succes." };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare: {ex.Message}" };
        }
    }

    private static LostPetInfoDto ToDto(LostPetEntity lp) => new()
    {
        Id = lp.Id,
        Species = lp.Species,
        City = lp.City,
        LostDate = lp.LostDate.ToString("yyyy-MM-dd"),
        Contact = lp.Contact,
        Description = lp.Description,
        IsFound = lp.IsFound
    };
}
