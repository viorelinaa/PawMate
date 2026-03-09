using PawMate.DataAccessLayer.Context;
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
        throw new NotImplementedException();
    }

    public ServiceResponse GetEventByIdAction(int id)
    {
        throw new NotImplementedException();
    }

    public ServiceResponse GetEventListAction()
    {
        throw new NotImplementedException();
    }
}
