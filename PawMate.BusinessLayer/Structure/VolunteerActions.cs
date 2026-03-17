using Microsoft.EntityFrameworkCore;
using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.Volunteer;
using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.Volunteer;

namespace PawMate.BusinessLayer.Structure;

public class VolunteerActions
{
    private readonly PawMateDbContext _context;

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
}
