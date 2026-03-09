using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.Volunteer;

namespace PawMate.BusinessLayer.Interfaces;

public interface IVolunteerLogic
{
    ServiceResponse CreateVolunteer(VolunteerCreateDto volunteer);
    ServiceResponse GetVolunteerById(int id);
    ServiceResponse GetVolunteerList();
}
