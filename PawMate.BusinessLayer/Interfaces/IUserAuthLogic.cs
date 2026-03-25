using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.User;

namespace PawMate.BusinessLayer.Interfaces;

public interface IUserAuthLogic
{
    ServiceResponse Login(UserLoginDto loginData);
}
