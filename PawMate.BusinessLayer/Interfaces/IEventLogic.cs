using PawMate.Domain.Models.Event;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IEventLogic
{
    ServiceResponse CreateEvent(EventCreateDto evt);
    ServiceResponse GetEventById(int id);
    ServiceResponse GetEventList();
}
