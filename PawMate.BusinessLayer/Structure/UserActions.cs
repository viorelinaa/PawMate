using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.User;

namespace PawMate.BusinessLayer.Structure;

public class UserActions
{
    private readonly PawMateDbContext _context;

    public UserActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreateUserAction(UserCreateDto user)
    {
        throw new NotImplementedException();
    }

    public ServiceResponse GetUserByIdAction(int id)
    {
        throw new NotImplementedException();
    }

    public ServiceResponse GetUserListAction()
    {
        throw new NotImplementedException();
    }
}
