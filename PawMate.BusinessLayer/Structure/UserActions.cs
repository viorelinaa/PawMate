using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using PawMate.Domain.Entities.ProfileAvatar;
using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.QuizResult;
using PawMate.Domain.Entities.User;
using PawMate.Domain.Models.ProfileAvatar;
using PawMate.Domain.Models.Quiz;
using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.User;

namespace PawMate.BusinessLayer.Structure;

public class UserActions
{
    private readonly PawMateDbContext _context;
    private readonly PasswordSecurityService _passwordSecurityService;

    public UserActions()
    {
        _context = new PawMateDbContext();
        _passwordSecurityService = new PasswordSecurityService();
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

            var passwordValidation = _passwordSecurityService.ValidatePassword(user.Password);
            if (!passwordValidation.IsValid)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = passwordValidation.ErrorMessage
                };
            }

            var entity = new UserEntity
            {
                Name = user.Name.Trim(),
                Email = email,
                Password = _passwordSecurityService.HashPassword(user.Password),
                Role = "user",
                Phone = string.Empty,
                City = string.Empty,
                Bio = string.Empty,
                Address = string.Empty,
                CreatedAt = DateTime.UtcNow
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

            var user = _context.Users.FirstOrDefault(u => u.Email.ToLower() == email);

            if (user == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Email sau parola invalida."
                };
            }

            var isPasswordValid = _passwordSecurityService.VerifyPassword(loginData.Password, user.Password);

            if (!isPasswordValid)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Email sau parola invalida."
                };
            }

            if (_passwordSecurityService.NeedsRehash(user.Password))
            {
                user.Password = _passwordSecurityService.HashPassword(loginData.Password);
                _context.SaveChanges();
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

    public ServiceResponse GetUserByIdAction(int id)
    {
        try
        {
            var dto = _context.Users
                .Where(user => user.Id == id)
                .Select(user => new UserInfoDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = string.Equals(user.Role, "admin", StringComparison.OrdinalIgnoreCase) ? "admin" : "user",
                    CreatedAt = user.CreatedAt,
                    SelectedAvatar = user.ProfileAvatarId == null
                        ? null
                        : new ProfileAvatarInfoDto
                        {
                            Id = user.ProfileAvatar!.Id,
                            Title = user.ProfileAvatar.Title,
                            ImageUrl = user.ProfileAvatar.ImageUrl
                        }
                })
                .FirstOrDefault();

            if (dto == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Utilizatorul nu a fost gasit."
                };
            }

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Utilizatorul a fost gasit.",
                Data = dto
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea utilizatorului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetUserListAction()
    {
        try
        {
            var users = _context.Users
                .Select(user => new UserInfoDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = string.Equals(user.Role, "admin", StringComparison.OrdinalIgnoreCase) ? "admin" : "user",
                    CreatedAt = user.CreatedAt,
                    SelectedAvatar = user.ProfileAvatarId == null
                        ? null
                        : new ProfileAvatarInfoDto
                        {
                            Id = user.ProfileAvatar!.Id,
                            Title = user.ProfileAvatar.Title,
                            ImageUrl = user.ProfileAvatar.ImageUrl
                        }
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista utilizatorilor a fost obtinuta cu succes.",
                Data = users
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea listei de utilizatori: {ex.Message}"
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

            var dto = BuildUserProfileDto(user);

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
            user.Address = profile.Address.Trim();

            _context.SaveChanges();

            var dto = BuildUserProfileDto(user);

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

    public ServiceResponse GetProfileAvatarOptionsAction()
    {
        try
        {
            var avatars = _context.ProfileAvatars
                .OrderByDescending(avatar => avatar.CreatedAt)
                .ThenByDescending(avatar => avatar.Id)
                .Select(avatar => new ProfileAvatarInfoDto
                {
                    Id = avatar.Id,
                    Title = avatar.Title,
                    ImageUrl = avatar.ImageUrl
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Avatarurile disponibile au fost obtinute cu succes.",
                Data = avatars
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea avatarurilor: {ex.Message}"
            };
        }
    }

    public ServiceResponse CreateProfileAvatarOptionAction(ProfileAvatarCreateDto avatarData)
    {
        try
        {
            var imageUrl = avatarData.ImageUrl.Trim();
            if (!Uri.TryCreate(imageUrl, UriKind.Absolute, out var avatarUri) ||
                (avatarUri.Scheme != Uri.UriSchemeHttp && avatarUri.Scheme != Uri.UriSchemeHttps))
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "URL-ul imaginii nu este valid."
                };
            }

            var normalizedUrl = avatarUri.ToString();
            var existingAvatar = _context.ProfileAvatars.FirstOrDefault(avatar => avatar.ImageUrl == normalizedUrl);
            if (existingAvatar != null)
            {
                return new ServiceResponse
                {
                    IsSuccess = true,
                    Message = "Avatarul exista deja.",
                    Data = MapProfileAvatar(existingAvatar)
                };
            }

            var avatar = new ProfileAvatarEntity
            {
                Title = string.IsNullOrWhiteSpace(avatarData.Title)
                    ? $"Avatar {DateTime.UtcNow:yyyyMMddHHmmss}"
                    : avatarData.Title.Trim(),
                ImageUrl = normalizedUrl,
                CreatedAt = DateTime.UtcNow
            };

            _context.ProfileAvatars.Add(avatar);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Avatarul a fost adaugat cu succes.",
                Data = MapProfileAvatar(avatar)
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la adaugarea avatarului: {ex.Message}"
            };
        }
    }

    public ServiceResponse SetUserProfileAvatarAction(int userId, UserProfileAvatarUpdateDto avatarData)
    {
        try
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Profilul nu a fost gasit."
                };
            }

            var avatar = _context.ProfileAvatars.FirstOrDefault(a => a.Id == avatarData.AvatarId);
            if (avatar == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Avatarul selectat nu exista."
                };
            }

            user.ProfileAvatarId = avatar.Id;
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Poza de profil a fost actualizata cu succes.",
                Data = BuildUserProfileDto(user)
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la actualizarea pozei de profil: {ex.Message}"
            };
        }
    }

    private UserProfileDto BuildUserProfileDto(UserEntity user)
    {
        var selectedAvatar = user.ProfileAvatarId == null
            ? null
            : _context.ProfileAvatars
                .Where(avatar => avatar.Id == user.ProfileAvatarId)
                .Select(avatar => new ProfileAvatarInfoDto
                {
                    Id = avatar.Id,
                    Title = avatar.Title,
                    ImageUrl = avatar.ImageUrl
                })
                .FirstOrDefault();

        var quizResults = _context.QuizResults
            .Where(quizResult => quizResult.UserId == user.Id)
            .OrderByDescending(quizResult => quizResult.CompletedAt)
            .ThenByDescending(quizResult => quizResult.Id)
            .Select(quizResult => new QuizResultInfoDto
            {
                Id = quizResult.Id,
                AnimalKey = quizResult.AnimalKey,
                AnimalName = quizResult.AnimalName,
                Score = quizResult.Score,
                TotalQuestions = quizResult.TotalQuestions,
                CompletedAt = quizResult.CompletedAt
            })
            .ToList();

        var latestQuizResult = quizResults.FirstOrDefault();

        return new UserProfileDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = string.Equals(user.Role, "admin", StringComparison.OrdinalIgnoreCase) ? "admin" : "user",
            Phone = user.Phone,
            City = user.City,
            Bio = user.Bio,
            Address = user.Address,
            CreatedAt = user.CreatedAt,
            SelectedAvatar = selectedAvatar,
            LatestQuizResult = latestQuizResult,
            QuizResults = quizResults
        };
    }

    private static ProfileAvatarInfoDto MapProfileAvatar(ProfileAvatarEntity avatar)
    {
        return new ProfileAvatarInfoDto
        {
            Id = avatar.Id,
            Title = avatar.Title,
            ImageUrl = avatar.ImageUrl
        };
    }
}
