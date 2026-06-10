using Microsoft.EntityFrameworkCore;
using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.Volunteer;
using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.Volunteer;

namespace PawMate.BusinessLayer.Structure;

public class VolunteerActions
{
    private readonly PawMateDbContext _context;
    private static readonly HashSet<string> ValidDecisionStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        "accepted",
        "rejected"
    };

    public VolunteerActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreateVolunteerAction(VolunteerCreateDto volunteer)
    {
        try
        {
            var entity = new VolunteerEntity
            {
                Title = volunteer.Title,
                Description = volunteer.Description,
                Location = volunteer.Location,
                Date = volunteer.Date
            };

            _context.VolunteerOpportunities.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Oportunitatea de voluntariat a fost creată cu succes.",
                Data = entity.Id
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la crearea oportunității de voluntariat: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetVolunteerByIdAction(int id)
    {
        try
        {
            var entity = _context.VolunteerOpportunities.FirstOrDefault(v => v.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Oportunitatea de voluntariat nu a fost găsită."
                };
            }

            var dto = new VolunteerInfoDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Description = entity.Description,
                Location = entity.Location,
                Date = entity.Date
            };

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Oportunitatea de voluntariat a fost găsită.",
                Data = dto
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea oportunității de voluntariat: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetVolunteerListAction()
    {
        try
        {
            var list = _context.VolunteerOpportunities
                .Select(v => new VolunteerInfoDto
                {
                    Id = v.Id,
                    Title = v.Title,
                    Description = v.Description,
                    Location = v.Location,
                    Date = v.Date
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista oportunităților de voluntariat a fost obținută cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea listei de oportunități: {ex.Message}"
            };
        }
    }

    public ServiceResponse CreateVolunteerApplicationAction(VolunteerApplicationCreateDto application, int userId)
    {
        try
        {
            var validationError = ValidateVolunteerApplication(application);
            if (validationError != null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = validationError
                };
            }

            var entity = new VolunteerApplicationEntity
            {
                UserId = userId,
                FirstName = application.FirstName.Trim(),
                LastName = application.LastName.Trim(),
                Email = application.Email.Trim(),
                Phone = application.Phone.Trim(),
                Age = application.Age,
                Experience = application.Experience.Trim(),
                Availability = application.Availability.Trim(),
                Activities = string.Join(", ", application.Activities.Select(a => a.Trim()).Where(a => !string.IsNullOrWhiteSpace(a))),
                Message = application.Message.Trim(),
                Status = "pending",
                AdminComment = string.Empty,
                CreatedAt = DateTime.UtcNow
            };

            _context.VolunteerApplications.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Cererea de voluntariat a fost trimisa cu succes.",
                Data = ToVolunteerApplicationInfoDto(entity)
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la trimiterea cererii de voluntariat: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetMyVolunteerApplicationsAction(int userId)
    {
        try
        {
            var list = _context.VolunteerApplications
                .Include(a => a.User)
                .Include(a => a.ReviewedByAdmin)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .AsEnumerable()
                .Select(a => ToVolunteerApplicationInfoDto(a))
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Cererile tale de voluntariat au fost obtinute cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea cererilor de voluntariat: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetVolunteerApplicationsForAdminAction()
    {
        try
        {
            var list = _context.VolunteerApplications
                .Include(a => a.User)
                .Include(a => a.ReviewedByAdmin)
                .OrderBy(a => a.Status == "pending" ? 0 : 1)
                .ThenByDescending(a => a.CreatedAt)
                .AsEnumerable()
                .Select(a => ToVolunteerApplicationInfoDto(a))
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Cererile de voluntariat au fost obtinute cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea cererilor de voluntariat: {ex.Message}"
            };
        }
    }

    public ServiceResponse ReviewVolunteerApplicationAction(int id, VolunteerApplicationDecisionDto decision, int adminId)
    {
        try
        {
            var status = decision.Status.Trim().ToLower();
            var comment = decision.AdminComment.Trim();

            if (!ValidDecisionStatuses.Contains(status))
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Statusul trebuie sa fie accepted sau rejected."
                };
            }

            if (string.IsNullOrWhiteSpace(comment))
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Comentariul adminului este obligatoriu."
                };
            }

            var entity = _context.VolunteerApplications
                .Include(a => a.User)
                .Include(a => a.ReviewedByAdmin)
                .FirstOrDefault(a => a.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Cererea de voluntariat nu a fost gasita."
                };
            }

            entity.Status = status;
            entity.AdminComment = comment;
            entity.ReviewedAt = DateTime.UtcNow;
            entity.ReviewedByAdminId = adminId;

            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Cererea de voluntariat a fost evaluata.",
                Data = ToVolunteerApplicationInfoDto(entity)
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la evaluarea cererii de voluntariat: {ex.Message}"
            };
        }
    }

    private static string? ValidateVolunteerApplication(VolunteerApplicationCreateDto application)
    {
        if (string.IsNullOrWhiteSpace(application.FirstName))
            return "Prenumele este obligatoriu.";
        if (string.IsNullOrWhiteSpace(application.LastName))
            return "Numele este obligatoriu.";
        if (string.IsNullOrWhiteSpace(application.Email))
            return "Emailul este obligatoriu.";
        if (string.IsNullOrWhiteSpace(application.Phone))
            return "Telefonul este obligatoriu.";
        if (application.Age < 16)
            return "Varsta minima pentru voluntariat este 16 ani.";
        if (string.IsNullOrWhiteSpace(application.Availability))
            return "Disponibilitatea este obligatorie.";

        return null;
    }

    private static VolunteerApplicationInfoDto ToVolunteerApplicationInfoDto(VolunteerApplicationEntity entity)
    {
        return new VolunteerApplicationInfoDto
        {
            Id = entity.Id,
            UserId = entity.UserId,
            UserName = entity.User?.Name ?? string.Empty,
            FirstName = entity.FirstName,
            LastName = entity.LastName,
            Email = entity.Email,
            Phone = entity.Phone,
            Age = entity.Age,
            Experience = entity.Experience,
            Availability = entity.Availability,
            Activities = entity.Activities
                .Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
                .ToList(),
            Message = entity.Message,
            Status = entity.Status,
            AdminComment = entity.AdminComment,
            CreatedAt = entity.CreatedAt,
            ReviewedAt = entity.ReviewedAt,
            ReviewedByAdminName = entity.ReviewedByAdmin?.Name ?? string.Empty
        };
    }
}
