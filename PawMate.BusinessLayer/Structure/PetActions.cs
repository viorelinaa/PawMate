using Microsoft.EntityFrameworkCore;
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
                Breed = pet.Breed,
                Age = pet.Age,
                Gender = pet.Gender,
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
                Breed = entity.Breed,
                Age = entity.Age,
                Gender = entity.Gender,
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
                    Breed = p.Breed,
                    Age = p.Age,
                    Gender = p.Gender,
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
}
