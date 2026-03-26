using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.Pet;
using PawMate.Domain.Models.Pet;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Structure;

public class PetActions
{
    private readonly PawMateDbContext _context;

    public PetActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreatePetAction(PetCreateDto pet)
    {
        try
        {
            var entity = new PetEntity
            {
                Name = pet.Name,
                Species = pet.Species,
                City = pet.City,
                Age = pet.Age,
                Size = pet.Size,
                Vaccinated = pet.Vaccinated,
                Sterilized = pet.Sterilized,
                Description = pet.Description
            };

            _context.Pets.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Animalul de companie a fost adăugat cu succes.",
                Data = entity.Id
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la adăugarea animalului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetPetByIdAction(int id)
    {
        try
        {
            var entity = _context.Pets.FirstOrDefault(p => p.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Animalul de companie nu a fost găsit."
                };
            }

            var dto = new PetInfoDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Species = entity.Species,
                City = entity.City,
                Age = entity.Age,
                Size = entity.Size,
                Vaccinated = entity.Vaccinated,
                Sterilized = entity.Sterilized,
                Description = entity.Description
            };

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Animalul de companie a fost găsit.",
                Data = dto
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea animalului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetPetListAction()
    {
        try
        {
            var list = _context.Pets
                .Select(p => new PetInfoDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Species = p.Species,
                    City = p.City,
                    Age = p.Age,
                    Size = p.Size,
                    Vaccinated = p.Vaccinated,
                    Sterilized = p.Sterilized,
                    Description = p.Description
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista animalelor a fost obținută cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea listei de animale: {ex.Message}"
            };
        }
    }

    public ServiceResponse UpdatePetAction(int id, PetUpdateDto pet)
    {
        try
        {
            var entity = _context.Pets.FirstOrDefault(p => p.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Animalul de companie nu a fost găsit."
                };
            }

            entity.Name = pet.Name;
            entity.Species = pet.Species;
            entity.City = pet.City;
            entity.Age = pet.Age;
            entity.Size = pet.Size;
            entity.Vaccinated = pet.Vaccinated;
            entity.Sterilized = pet.Sterilized;
            entity.Description = pet.Description;

            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Animalul de companie a fost actualizat cu succes."
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la actualizarea animalului: {ex.Message}"
            };
        }
    }

    public ServiceResponse DeletePetAction(int id)
    {
        try
        {
            var entity = _context.Pets.FirstOrDefault(p => p.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Animalul de companie nu a fost găsit."
                };
            }

            _context.Pets.Remove(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Animalul de companie a fost șters cu succes."
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la ștergerea animalului: {ex.Message}"
            };
        }
    }
}
