using System;
using System.Linq;

namespace PawMate.BusinessLayer.Structure;

public class PasswordSecurityService
{
    private const int WorkFactor = 12;

    public (bool IsValid, string ErrorMessage) ValidatePassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            return (false, "Parola este obligatorie.");
        }

        if (password.Length < 8)
        {
            return (false, "Parola trebuie sa aiba minim 8 caractere.");
        }

        if (!password.Any(char.IsUpper))
        {
            return (false, "Parola trebuie sa contina cel putin o litera mare.");
        }

        if (!password.Any(char.IsLower))
        {
            return (false, "Parola trebuie sa contina cel putin o litera mica.");
        }

        if (!password.Any(char.IsDigit))
        {
            return (false, "Parola trebuie sa contina cel putin o cifra.");
        }

        if (!password.Any(ch => !char.IsLetterOrDigit(ch)))
        {
            return (false, "Parola trebuie sa contina cel putin un caracter special.");
        }

        return (true, string.Empty);
    }

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, workFactor: WorkFactor);
    }

    public bool VerifyPassword(string password, string storedPassword)
    {
        if (string.IsNullOrWhiteSpace(storedPassword))
        {
            return false;
        }

        if (!IsBcryptHash(storedPassword))
        {
            return password == storedPassword;
        }

        return BCrypt.Net.BCrypt.Verify(password, storedPassword);
    }

    public bool NeedsRehash(string storedPassword)
    {
        return !IsBcryptHash(storedPassword);
    }

    private static bool IsBcryptHash(string value)
    {
        return value.StartsWith("$2a$", StringComparison.Ordinal) ||
               value.StartsWith("$2b$", StringComparison.Ordinal) ||
               value.StartsWith("$2y$", StringComparison.Ordinal);
    }
}
