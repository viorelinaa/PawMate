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

    public ServiceResponse CreateVolunteerApplication(VolunteerApplicationCreateDto application, int userId)
    {
        return CreateVolunteerApplicationAction(application, userId);
    }

    public ServiceResponse GetMyVolunteerApplications(int userId)
    {
        return GetMyVolunteerApplicationsAction(userId);
    }

    public ServiceResponse GetVolunteerApplicationsForAdmin()
    {
        return GetVolunteerApplicationsForAdminAction();
    }

    public ServiceResponse ReviewVolunteerApplication(int id, VolunteerApplicationDecisionDto decision, int adminId)
    {
        return ReviewVolunteerApplicationAction(id, decision, adminId);
    }
}
