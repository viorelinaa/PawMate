using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Models.LostPet;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Structure;

public class LostPetActions
{
    private readonly PawMateDbContext _context;

    public LostPetActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreateLostPetAction(LostPetCreateDto lostPet)
    {
        throw new NotImplementedException();
    }

    public ServiceResponse GetLostPetByIdAction(int id)
    {
        throw new NotImplementedException();
    }

    public ServiceResponse GetLostPetListAction()
    {
        throw new NotImplementedException();
    }
}
