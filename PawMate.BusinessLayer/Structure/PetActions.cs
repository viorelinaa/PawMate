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

    public ServiceResponse CreatePetAction(PetCreateDto pet, int userId)
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
                Description = pet.Description,
                UserId = userId
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
                Description = entity.Description,
                ImageUrl = entity.ImageUrl,
                UserId = entity.UserId
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

    public ServiceResponse GetPetListAction(PetQueryDto query)
    {
        try
        {
            var petsQuery = _context.Pets.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var search = query.Search.Trim().ToLower();
                petsQuery = petsQuery.Where(p =>
                    p.Name.ToLower().Contains(search) ||
                    p.Description.ToLower().Contains(search));
            }

            if (!string.IsNullOrWhiteSpace(query.City) && query.City != "ALL")
            {
                petsQuery = petsQuery.Where(p => p.City == query.City);
            }

            if (!string.IsNullOrWhiteSpace(query.Species) && query.Species != "ALL")
            {
                petsQuery = petsQuery.Where(p => p.Species == query.Species);
            }

            if (!string.IsNullOrWhiteSpace(query.Age) && query.Age != "ALL")
            {
                petsQuery = petsQuery.Where(p => p.Age == query.Age);
            }

            if (!string.IsNullOrWhiteSpace(query.Size) && query.Size != "ALL")
            {
                petsQuery = petsQuery.Where(p => p.Size == query.Size);
            }

            if (query.OnlyVaccinated)
            {
                petsQuery = petsQuery.Where(p => p.Vaccinated);
            }

            if (query.OnlySterilized)
            {
                petsQuery = petsQuery.Where(p => p.Sterilized);
            }

            petsQuery = query.SortBy?.ToLower() switch
            {
                "name" when query.SortDirection == "desc" => petsQuery.OrderByDescending(p => p.Name),
                "name" => petsQuery.OrderBy(p => p.Name),
                "city" when query.SortDirection == "desc" => petsQuery.OrderByDescending(p => p.City),
                "city" => petsQuery.OrderBy(p => p.City),
                _ => petsQuery.OrderByDescending(p => p.Id)
            };

            var list = petsQuery
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
                    Description = p.Description,
                    ImageUrl = p.ImageUrl,
                    UserId = p.UserId
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista animalelor a fost obtinuta cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea listei de animale: {ex.Message}"
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


    public ServiceResponse UpdatePetImageAction(int id, int userId, bool isAdmin, string imageUrl)
    {
        try
        {
            var entity = _context.Pets.FirstOrDefault(p => p.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Animalul de companie nu a fost gasit."
                };
            }

            if (!isAdmin && entity.UserId != userId)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Poti modifica doar animalele adaugate de tine."
                };
            }

            entity.ImageUrl = imageUrl;
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Imaginea animalului a fost salvata cu succes.",
                Data = imageUrl
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la salvarea imaginii: {ex.Message}"
            };
        }
    }
    public ServiceResponse DeletePetAction(int id, int userId, bool isAdmin)
    {
        try
        {
            var entity = _context.Pets.FirstOrDefault(p => p.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Animalul de companie nu a fost gasit."
                };
            }

            if (!isAdmin && entity.UserId != userId)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Poti sterge doar animalele adaugate de tine."
                };
            }

            var adoptionRequests = _context.Adoptions.Where(a => a.PetId == id);
            _context.Adoptions.RemoveRange(adoptionRequests);
            _context.Pets.Remove(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Animalul de companie a fost sters cu succes."
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la stergerea animalului: {ex.Message}"
            };
        }
    }
}
