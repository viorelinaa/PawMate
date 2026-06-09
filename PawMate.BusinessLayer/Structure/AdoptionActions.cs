using Microsoft.EntityFrameworkCore;
using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.Adoption;
using PawMate.Domain.Models.Adoption;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Structure;

public class AdoptionActions
{
    private static readonly HashSet<string> ValidStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        "pending",
        "accepted",
        "rejected"
    };

    private readonly PawMateDbContext _context;

    public AdoptionActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreateAdoptionAction(AdoptionCreateDto adoption, int userId)
    {
        try
        {
            if (adoption.PetId <= 0)
            {
                return new ServiceResponse { IsSuccess = false, Message = "Alege animalul pentru care trimiti cererea." };
            }

            if (string.IsNullOrWhiteSpace(adoption.ApplicantName) ||
                string.IsNullOrWhiteSpace(adoption.ApplicantPhone) ||
                string.IsNullOrWhiteSpace(adoption.LivingConditions))
            {
                return new ServiceResponse { IsSuccess = false, Message = "Completeaza numele, telefonul si conditiile de trai." };
            }

            var pet = _context.Pets.FirstOrDefault(p => p.Id == adoption.PetId);
            if (pet == null)
            {
                return new ServiceResponse { IsSuccess = false, Message = "Animalul nu a fost gasit." };
            }

            if (pet.UserId == userId)
            {
                return new ServiceResponse { IsSuccess = false, Message = "Nu poti trimite cerere pentru animalul adaugat de tine." };
            }

            var hasPendingRequest = _context.Adoptions.Any(a =>
                a.PetId == adoption.PetId &&
                a.UserId == userId &&
                a.Status == "pending");

            if (hasPendingRequest)
            {
                return new ServiceResponse { IsSuccess = false, Message = "Ai deja o cerere in asteptare pentru acest animal." };
            }

            var entity = new AdoptionEntity
            {
                PetId = adoption.PetId,
                UserId = userId,
                Status = "pending",
                CreatedAt = DateTime.UtcNow,
                ApplicantName = adoption.ApplicantName.Trim(),
                ApplicantPhone = adoption.ApplicantPhone.Trim(),
                Message = adoption.Message.Trim(),
                AnimalExperience = adoption.AnimalExperience.Trim(),
                LivingConditions = adoption.LivingConditions.Trim()
            };

            _context.Adoptions.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Cererea de adoptie a fost trimisa cu succes.",
                Data = entity.Id
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la crearea cererii de adoptie: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetAdoptionByIdAction(int id, int userId, bool isAdmin)
    {
        try
        {
            var entity = GetAdoptionsQuery().FirstOrDefault(a => a.Id == id);
            if (entity == null)
            {
                return new ServiceResponse { IsSuccess = false, Message = "Cererea de adoptie nu a fost gasita." };
            }

            var canView = isAdmin || entity.UserId == userId || entity.Pet.UserId == userId;
            if (!canView)
            {
                return new ServiceResponse { IsSuccess = false, Message = "Nu ai dreptul sa vezi aceasta cerere." };
            }

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Cererea de adoptie a fost gasita.",
                Data = ToDto(entity)
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea cererii de adoptie: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetAdoptionListAction()
    {
        try
        {
            var list = GetAdoptionsQuery()
                .OrderByDescending(a => a.CreatedAt)
                .AsEnumerable()
                .Select(ToDto)
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista cererilor de adoptie a fost obtinuta cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea listei de adoptii: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetMyAdoptionListAction(int userId)
    {
        try
        {
            var list = GetAdoptionsQuery()
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .AsEnumerable()
                .Select(ToDto)
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Cererile tale de adoptie au fost obtinute cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare: {ex.Message}" };
        }
    }

    public ServiceResponse GetReceivedAdoptionListAction(int userId, bool isAdmin)
    {
        try
        {
            var query = GetAdoptionsQuery();
            if (!isAdmin)
            {
                query = query.Where(a => a.Pet.UserId == userId);
            }

            var list = query
                .OrderByDescending(a => a.CreatedAt)
                .AsEnumerable()
                .Select(ToDto)
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Cererile primite au fost obtinute cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare: {ex.Message}" };
        }
    }

    public ServiceResponse UpdateAdoptionStatusAction(int id, AdoptionStatusUpdateDto status, int userId, bool isAdmin)
    {
        try
        {
            var normalizedStatus = status.Status.Trim().ToLowerInvariant();
            if (!ValidStatuses.Contains(normalizedStatus) || normalizedStatus == "pending")
            {
                return new ServiceResponse { IsSuccess = false, Message = "Statusul cererii nu este valid." };
            }

            var entity = _context.Adoptions
                .Include(a => a.Pet)
                .FirstOrDefault(a => a.Id == id);

            if (entity == null)
            {
                return new ServiceResponse { IsSuccess = false, Message = "Cererea de adoptie nu a fost gasita." };
            }

            if (!isAdmin && entity.Pet.UserId != userId)
            {
                return new ServiceResponse { IsSuccess = false, Message = "Poti modifica doar cererile primite pentru animalele tale." };
            }

            entity.Status = normalizedStatus;
            entity.ReviewedAt = DateTime.UtcNow;
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Statusul cererii a fost actualizat cu succes.",
                Data = ToDto(GetAdoptionsQuery().First(a => a.Id == id))
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare: {ex.Message}" };
        }
    }

    private IQueryable<AdoptionEntity> GetAdoptionsQuery()
    {
        return _context.Adoptions
            .Include(a => a.Pet)
            .Include(a => a.User);
    }

    private static AdoptionInfoDto ToDto(AdoptionEntity a) => new()
    {
        Id = a.Id,
        PetId = a.PetId,
        UserId = a.UserId,
        OwnerUserId = a.Pet.UserId,
        Status = a.Status,
        CreatedAt = a.CreatedAt,
        ReviewedAt = a.ReviewedAt,
        ApplicantName = a.ApplicantName,
        ApplicantPhone = a.ApplicantPhone,
        Message = a.Message,
        AnimalExperience = a.AnimalExperience,
        LivingConditions = a.LivingConditions,
        ApplicantUserName = a.User.Name,
        ApplicantEmail = a.User.Email,
        PetName = a.Pet.Name,
        PetSpecies = a.Pet.Species,
        PetCity = a.Pet.City,
        PetImageUrl = a.Pet.ImageUrl
    };
}