using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Models.Adoption;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Structure;

public class AdoptionActions
{
    private readonly PawMateDbContext _context;

    public AdoptionActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreateAdoptionAction(AdoptionCreateDto adoption)
    {
        throw new NotImplementedException();
    }

    public ServiceResponse GetAdoptionByIdAction(int id)
    {
        throw new NotImplementedException();
    }

    public ServiceResponse GetAdoptionListAction()
    {
        throw new NotImplementedException();
    }
}
