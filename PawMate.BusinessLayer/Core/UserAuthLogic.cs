using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.User;

namespace PawMate.BusinessLayer.Core;

public class UserAuthLogic : UserActions, IUserAuthLogic
{
    public ServiceResponse Login(UserLoginDto loginData)
    {
        return LoginUserAction(loginData);
    }
}
