using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Models.Pet;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Structure;

public class PetActions
{
    private readonly PawMateDbContext _context;

    public PetActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreatePetAction(PetCreateDto pet)
    {
        throw new NotImplementedException();
    }

    public ServiceResponse GetPetByIdAction(int id)
    {
        throw new NotImplementedException();
    }

    public ServiceResponse GetPetListAction()
    {
        throw new NotImplementedException();
    }
}
