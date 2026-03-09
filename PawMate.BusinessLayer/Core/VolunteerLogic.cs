using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.Volunteer;

namespace PawMate.BusinessLayer.Core;

public class VolunteerLogic : VolunteerActions, IVolunteerLogic
{
    public ServiceResponse CreateVolunteer(VolunteerCreateDto volunteer)
    {
        return CreateVolunteerAction(volunteer);
    }

    public ServiceResponse GetVolunteerById(int id)
    {
        return GetVolunteerByIdAction(id);
    }

    public ServiceResponse GetVolunteerList()
    {
        return GetVolunteerListAction();
    }
}
