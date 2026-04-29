using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Event;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Core;

public class EventLogic : EventActions, IEventLogic
{
    public ServiceResponse CreateEvent(EventCreateDto evt)
    {
        return CreateEventAction(evt);
    }

    public ServiceResponse UpdateEvent(int id, EventUpdateDto evt)
    {
        return UpdateEventAction(id, evt);
    }

    public ServiceResponse DeleteEvent(int id)
    {
        return DeleteEventAction(id);
    }

    public ServiceResponse GetEventById(int id)
    {
        return GetEventByIdAction(id);
    }

    public ServiceResponse GetEventList()
    {
        return GetEventListAction();
    }
}
