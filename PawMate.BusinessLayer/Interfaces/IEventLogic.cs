using PawMate.Domain.Models.Event;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IEventLogic
{
    ServiceResponse CreateEvent(EventCreateDto evt);
    ServiceResponse UpdateEvent(int id, EventUpdateDto evt);
    ServiceResponse DeleteEvent(int id);
    ServiceResponse GetEventById(int id);
    ServiceResponse GetEventList(EventQueryDto query);
}
