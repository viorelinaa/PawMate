using Microsoft.EntityFrameworkCore;
using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.User;
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
        try
        {
            var entity = new UserEntity
            {
                Name = user.Name,
                Email = user.Email,
                Password = user.Password,
                Role = "user"
            };

            _context.Users.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Utilizatorul a fost creat cu succes.",
                Data = entity.Id
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la crearea utilizatorului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetUserByIdAction(int id)
    {
        try
        {
            var entity = _context.Users.FirstOrDefault(u => u.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Utilizatorul nu a fost găsit."
                };
            }

            var dto = new UserInfoDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Email = entity.Email,
                Role = entity.Role
            };

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Utilizatorul a fost găsit.",
                Data = dto
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea utilizatorului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetUserListAction()
    {
        try
        {
            var list = _context.Users
                .Select(u => new UserInfoDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista utilizatorilor a fost obținută cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea listei de utilizatori: {ex.Message}"
            };
        }
    }
}
