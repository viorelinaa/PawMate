using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.Volunteer;

namespace PawMate.BusinessLayer.Interfaces;

public interface IVolunteerLogic
{
    ServiceResponse CreateVolunteer(VolunteerCreateDto volunteer);
    ServiceResponse GetVolunteerById(int id);
    ServiceResponse GetVolunteerList();
    ServiceResponse CreateVolunteerApplication(VolunteerApplicationCreateDto application, int userId);
    ServiceResponse GetMyVolunteerApplications(int userId);
    ServiceResponse GetVolunteerApplicationsForAdmin();
    ServiceResponse ReviewVolunteerApplication(int id, VolunteerApplicationDecisionDto decision, int adminId);
}
