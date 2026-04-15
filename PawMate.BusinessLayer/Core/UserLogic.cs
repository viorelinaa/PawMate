using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.User;

namespace PawMate.BusinessLayer.Core;

public class UserLogic : UserActions, IUserLogic
{
    public ServiceResponse CreateUser(UserCreateDto user)
    {
        return CreateUserAction(user);
    }

    public ServiceResponse GetUserById(int id)
    {
        return GetUserByIdAction(id);
    }

    public ServiceResponse GetUserList()
    {
        return GetUserListAction();
    }

    public ServiceResponse UpdateUserStatus(int id, UserStatusUpdateDto statusData)
    {
        return UpdateUserStatusAction(id, statusData);
    }
}
