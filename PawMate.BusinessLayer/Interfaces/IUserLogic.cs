using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.User;

namespace PawMate.BusinessLayer.Interfaces;

public interface IUserLogic
{
    ServiceResponse CreateUser(UserCreateDto user);
    ServiceResponse GetUserById(int id);
    ServiceResponse GetUserList();
    ServiceResponse UpdateUserStatus(int id, UserStatusUpdateDto statusData);
}
