using Microsoft.EntityFrameworkCore;
using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.Event;
using PawMate.Domain.Models.Event;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Structure;

public class EventActions
{
    private readonly PawMateDbContext _context;

    public EventActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreateEventAction(EventCreateDto evt)
    {
        try
        {
            var entity = new EventEntity
            {
                Title = evt.Title,
                Description = evt.Description,
                Location = evt.Location,
                Date = evt.Date
            };

            _context.Events.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Evenimentul a fost creat cu succes.",
                Data = entity.Id
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la crearea evenimentului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetEventByIdAction(int id)
    {
        try
        {
            var entity = _context.Events.FirstOrDefault(e => e.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Evenimentul nu a fost găsit."
                };
            }

            var dto = new EventInfoDto
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
                Message = "Evenimentul a fost găsit.",
                Data = dto
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea evenimentului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetEventListAction(EventQueryDto query)
    {
        try
        {
            var eventsQuery = _context.Events.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var search = query.Search.Trim().ToLower();
                eventsQuery = eventsQuery.Where(e =>
                    e.Title.ToLower().Contains(search) ||
                    e.Description.ToLower().Contains(search));
            }

            if (!string.IsNullOrWhiteSpace(query.Location) && query.Location != "ALL")
            {
                eventsQuery = eventsQuery.Where(e => e.Location == query.Location);
            }

            eventsQuery = query.SortBy?.ToLower() switch
            {
                "title" when query.SortDirection == "desc" => eventsQuery.OrderByDescending(e => e.Title),
                "title" => eventsQuery.OrderBy(e => e.Title),
                "date" when query.SortDirection == "asc" => eventsQuery.OrderBy(e => e.Date),
                _ => eventsQuery.OrderByDescending(e => e.Date)
            };

            var list = eventsQuery
                .Select(e => new EventInfoDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    Description = e.Description,
                    Location = e.Location,
                    Date = e.Date
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista evenimentelor a fost obtinuta cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea listei de evenimente: {ex.Message}"
            };
        }
    }

    public ServiceResponse UpdateEventAction(int id, EventUpdateDto evt)
    {
        try
        {
            var entity = _context.Events.FirstOrDefault(e => e.Id == id);
            if (entity == null)
                return new ServiceResponse { IsSuccess = false, Message = "Evenimentul nu a fost găsit." };

            entity.Title = evt.Title;
            entity.Description = evt.Description;
            entity.Location = evt.Location;
            entity.Date = evt.Date;

            _context.SaveChanges();

            return new ServiceResponse { IsSuccess = true, Message = "Evenimentul a fost actualizat cu succes." };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare la actualizarea evenimentului: {ex.Message}" };
        }
    }

    public ServiceResponse DeleteEventAction(int id)
    {
        try
        {
            var entity = _context.Events.FirstOrDefault(e => e.Id == id);
            if (entity == null)
                return new ServiceResponse { IsSuccess = false, Message = "Evenimentul nu a fost găsit." };

            _context.Events.Remove(entity);
            _context.SaveChanges();

            return new ServiceResponse { IsSuccess = true, Message = "Evenimentul a fost șters cu succes." };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare la ștergerea evenimentului: {ex.Message}" };
        }
    }
}
