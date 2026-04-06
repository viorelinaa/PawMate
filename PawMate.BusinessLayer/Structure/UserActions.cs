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
            var email = user.Email.Trim().ToLower();

            var existingUser = _context.Users.FirstOrDefault(u => u.Email.ToLower() == email);
            if (existingUser != null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Exista deja un cont cu acest email."
                };
            }

            var entity = new UserEntity
            {
                Name = user.Name.Trim(),
                Email = email,
                Password = user.Password,
                Role = "user",
                Phone = string.Empty,
                City = string.Empty,
                Bio = string.Empty
            };

            _context.Users.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Contul a fost creat cu succes."
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la inregistrare: {ex.Message}"
            };
        }
    }

    public ServiceResponse LoginUserAction(UserLoginDto loginData)
    {
        try
        {
            var email = loginData.Email.Trim().ToLower();

            var user = _context.Users.FirstOrDefault(u =>
                u.Email.ToLower() == email &&
                u.Password == loginData.Password);

            if (user == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Email sau parola invalida."
                };
            }

            var normalizedRole = string.Equals(user.Role, "admin", StringComparison.OrdinalIgnoreCase)
                ? "admin"
                : "user";

            var token = new TokenService().GenerateToken();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Autentificare reusita.",
                Data = new
                {
                    Token = token,
                    UserId = user.Id,
                    Role = normalizedRole,
                    Name = user.Name,
                    Email = user.Email
                }
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la autentificare: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetUserProfileAction(int id)
    {
        try
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Profilul nu a fost gasit."
                };
            }

            var dto = new UserProfileDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = string.Equals(user.Role, "admin", StringComparison.OrdinalIgnoreCase) ? "admin" : "user",
                Phone = user.Phone,
                City = user.City,
                Bio = user.Bio
            };

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Profilul a fost obtinut cu succes.",
                Data = dto
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea profilului: {ex.Message}"
            };
        }
    }

    public ServiceResponse UpdateUserProfileAction(int id, UserProfileUpdateDto profile)
    {
        try
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Profilul nu a fost gasit."
                };
            }

            var normalizedEmail = profile.Email.Trim().ToLower();

            var existingUserWithEmail = _context.Users.FirstOrDefault(u =>
                u.Email.ToLower() == normalizedEmail && u.Id != id);

            if (existingUserWithEmail != null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Exista deja un alt cont cu acest email."
                };
            }

            user.Name = profile.Name.Trim();
            user.Email = normalizedEmail;
            user.Phone = profile.Phone.Trim();
            user.City = profile.City.Trim();
            user.Bio = profile.Bio.Trim();

            _context.SaveChanges();

            var dto = new UserProfileDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = string.Equals(user.Role, "admin", StringComparison.OrdinalIgnoreCase) ? "admin" : "user",
                Phone = user.Phone,
                City = user.City,
                Bio = user.Bio
            };

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Profilul a fost actualizat cu succes.",
                Data = dto
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la actualizarea profilului: {ex.Message}"
            };
        }
    }
}
