using PawMate.DataAccessLayer.Context;
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
        throw new NotImplementedException();
    }

    public ServiceResponse GetVolunteerByIdAction(int id)
    {
        throw new NotImplementedException();
    }

    public ServiceResponse GetVolunteerListAction()
    {
        throw new NotImplementedException();
    }
}
