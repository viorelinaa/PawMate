using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.VeterinaryClinic;
using PawMate.Domain.Models.Service;
using PawMate.Domain.Models.VeterinaryClinic;
using System.Net;
using System.Text.RegularExpressions;

namespace PawMate.BusinessLayer.Structure;

public class VeterinaryClinicActions
{
    private readonly PawMateDbContext _context;

    public VeterinaryClinicActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreateVeterinaryClinicAction(VeterinaryClinicCreateDto clinic)
    {
        try
        {
            var clinicValues = PrepareVeterinaryClinic(clinic);
            var validationError = ValidateVeterinaryClinic(clinicValues);
            if (validationError != null)
            {
                return Failure(validationError);
            }

            if (ClinicExists(clinicValues))
            {
                return Failure("Există deja o clinică înregistrată cu acest nume și adresă.");
            }

            var entity = new VeterinaryClinicEntity();
            ApplyVeterinaryClinicValues(entity, clinicValues);

            _context.VeterinaryClinics.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Clinica veterinară a fost adăugată cu succes.",
                Data = entity.Id
            };
        }
        catch (Exception ex)
        {
            return Failure($"A apărut o eroare la adăugarea clinicii: {ex.Message}");
        }
    }

    public ServiceResponse UpdateVeterinaryClinicAction(int id, VeterinaryClinicUpdateDto clinic)
    {
        try
        {
            var entity = _context.VeterinaryClinics.FirstOrDefault(v => v.Id == id);

            if (entity == null)
            {
                return Failure("Clinica veterinară nu a fost găsită.");
            }

            var clinicValues = PrepareVeterinaryClinic(clinic);
            var validationError = ValidateVeterinaryClinic(clinicValues);
            if (validationError != null)
            {
                return Failure(validationError);
            }

            if (ClinicExists(clinicValues, id))
            {
                return Failure("Există deja o clinică înregistrată cu acest nume și adresă.");
            }

            ApplyVeterinaryClinicValues(entity, clinicValues);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Clinica veterinară a fost actualizată cu succes.",
                Data = MapToDto(entity)
            };
        }
        catch (Exception ex)
        {
            return Failure($"A apărut o eroare la actualizarea clinicii: {ex.Message}");
        }
    }

    public ServiceResponse GetVeterinaryClinicListAction()
    {
        try
        {
            var list = _context.VeterinaryClinics
                .OrderBy(v => v.City)
                .ThenBy(v => v.Name)
                .ToList()
                .Select(MapToDto)
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista clinicilor veterinare a fost obținută cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return Failure($"A apărut o eroare la obținerea clinicilor: {ex.Message}");
        }
    }

    public ServiceResponse GetVeterinaryClinicByIdAction(int id)
    {
        try
        {
            var entity = _context.VeterinaryClinics.FirstOrDefault(v => v.Id == id);

            if (entity == null)
            {
                return Failure("Clinica veterinară nu a fost găsită.");
            }

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Clinica veterinară a fost găsită.",
                Data = MapToDto(entity)
            };
        }
        catch (Exception ex)
        {
            return Failure($"A apărut o eroare la obținerea clinicii: {ex.Message}");
        }
    }

    public ServiceResponse DeleteVeterinaryClinicAction(int id)
    {
        try
        {
            var entity = _context.VeterinaryClinics.FirstOrDefault(v => v.Id == id);

            if (entity == null)
            {
                return Failure("Clinica veterinară nu a fost găsită.");
            }

            _context.VeterinaryClinics.Remove(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Clinica veterinară a fost ștearsă cu succes."
            };
        }
        catch (Exception ex)
        {
            return Failure($"A apărut o eroare la ștergerea clinicii: {ex.Message}");
        }
    }

    private static VeterinaryClinicInfoDto MapToDto(VeterinaryClinicEntity entity)
    {
        var mapEmbedUrl = IsEmbeddableMapUrl(entity.MapEmbedUrl)
            ? entity.MapEmbedUrl
            : BuildMapEmbedUrl(entity.MapEmbedUrl, entity.GoogleMapsUrl, entity.Address, entity.City);

        return new VeterinaryClinicInfoDto
        {
            Id = entity.Id,
            Name = entity.Name,
            City = entity.City,
            Address = entity.Address,
            Phone = entity.Phone,
            Services = SplitServices(entity.Services),
            Emergency = entity.Emergency,
            Description = entity.Description,
            GoogleMapsUrl = entity.GoogleMapsUrl,
            AppleMapsUrl = entity.AppleMapsUrl,
            MapEmbedUrl = mapEmbedUrl
        };
    }

    private static VeterinaryClinicValues PrepareVeterinaryClinic(VeterinaryClinicCreateDto clinic)
    {
        var name = clinic.Name?.Trim() ?? string.Empty;
        var city = clinic.City?.Trim() ?? string.Empty;
        var address = clinic.Address?.Trim() ?? string.Empty;
        var phone = clinic.Phone?.Trim() ?? string.Empty;
        var description = clinic.Description?.Trim() ?? string.Empty;
        var googleMapsUrl = clinic.GoogleMapsUrl?.Trim() ?? string.Empty;
        var appleMapsUrl = clinic.AppleMapsUrl?.Trim() ?? string.Empty;
        var rawMapEmbedUrl = ExtractIframeSrc(clinic.MapEmbedUrl?.Trim() ?? string.Empty);

        if (string.IsNullOrWhiteSpace(googleMapsUrl) &&
            !string.IsNullOrWhiteSpace(rawMapEmbedUrl) &&
            !IsEmbeddableMapUrl(rawMapEmbedUrl))
        {
            googleMapsUrl = rawMapEmbedUrl;
        }

        var mapEmbedUrl = BuildMapEmbedUrl(rawMapEmbedUrl, googleMapsUrl, address, city);
        var services = NormalizeServices(clinic.Services);

        return new VeterinaryClinicValues(
            name,
            city,
            address,
            phone,
            services,
            clinic.Emergency,
            description,
            googleMapsUrl,
            appleMapsUrl,
            mapEmbedUrl);
    }

    private static string? ValidateVeterinaryClinic(VeterinaryClinicValues clinic)
    {
        if (string.IsNullOrWhiteSpace(clinic.Name))
        {
            return "Numele clinicii este obligatoriu.";
        }

        if (string.IsNullOrWhiteSpace(clinic.City))
        {
            return "Orașul este obligatoriu.";
        }

        if (string.IsNullOrWhiteSpace(clinic.Address) &&
            string.IsNullOrWhiteSpace(clinic.GoogleMapsUrl) &&
            string.IsNullOrWhiteSpace(clinic.MapEmbedUrl))
        {
            return "Adresa sau un link de hartă este obligatoriu.";
        }

        if (string.IsNullOrWhiteSpace(clinic.Phone))
        {
            return "Telefonul este obligatoriu.";
        }

        if (clinic.Services.Length == 0)
        {
            return "Adaugă cel puțin un serviciu.";
        }

        return null;
    }

    private bool ClinicExists(VeterinaryClinicValues clinic, int? excludedId = null)
    {
        var name = clinic.Name.ToLower();
        var city = clinic.City.ToLower();
        var address = clinic.Address.ToLower();

        return _context.VeterinaryClinics.Any(v =>
            (!excludedId.HasValue || v.Id != excludedId.Value) &&
            v.Name.ToLower() == name &&
            v.City.ToLower() == city &&
            v.Address.ToLower() == address);
    }

    private static void ApplyVeterinaryClinicValues(VeterinaryClinicEntity entity, VeterinaryClinicValues clinic)
    {
        entity.Name = clinic.Name;
        entity.City = clinic.City;
        entity.Address = clinic.Address;
        entity.Phone = clinic.Phone;
        entity.Services = string.Join(" | ", clinic.Services);
        entity.Emergency = clinic.Emergency;
        entity.Description = clinic.Description;
        entity.GoogleMapsUrl = clinic.GoogleMapsUrl;
        entity.AppleMapsUrl = clinic.AppleMapsUrl;
        entity.MapEmbedUrl = clinic.MapEmbedUrl;
    }

    private static string[] NormalizeServices(IEnumerable<string>? services)
    {
        return services?
            .Select(service => service.Trim())
            .Where(service => !string.IsNullOrWhiteSpace(service))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray() ?? [];
    }

    private static string[] SplitServices(string services)
    {
        return services
            .Split('|', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
            .ToArray();
    }

    private static string ExtractIframeSrc(string value)
    {
        var decoded = WebUtility.HtmlDecode(value);
        var match = Regex.Match(decoded, "src=[\"']([^\"']+)[\"']", RegexOptions.IgnoreCase);
        return match.Success ? match.Groups[1].Value.Trim() : decoded.Trim();
    }

    private static string BuildMapEmbedUrl(string mapEmbedUrl, string googleMapsUrl, string address, string city)
    {
        if (IsEmbeddableMapUrl(mapEmbedUrl))
        {
            return mapEmbedUrl;
        }

        var candidates = new[] { mapEmbedUrl, googleMapsUrl }
            .Where(url => !string.IsNullOrWhiteSpace(url))
            .Distinct(StringComparer.OrdinalIgnoreCase);

        foreach (var candidate in candidates)
        {
            var coordinates = TryExtractCoordinates(candidate) ??
                              TryExtractCoordinates(ResolveRedirectUrl(candidate));

            if (!string.IsNullOrWhiteSpace(coordinates))
            {
                return $"https://www.google.com/maps?q={Uri.EscapeDataString(coordinates)}&z=17&output=embed";
            }
        }

        var query = string.Join(", ", new[] { address, city, "Moldova" }.Where(part => !string.IsNullOrWhiteSpace(part)));
        return string.IsNullOrWhiteSpace(query)
            ? string.Empty
            : $"https://www.google.com/maps?q={Uri.EscapeDataString(query)}&output=embed";
    }

    private static bool IsEmbeddableMapUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            return false;
        }

        return uri.Host.Contains("google.", StringComparison.OrdinalIgnoreCase) &&
               (uri.AbsolutePath.Contains("/maps/embed", StringComparison.OrdinalIgnoreCase) ||
                uri.Query.Contains("output=embed", StringComparison.OrdinalIgnoreCase));
    }

    private static string? TryExtractCoordinates(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            return null;
        }

        var decodedUrl = WebUtility.UrlDecode(url);
        var patterns = new[]
        {
            @"!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)",
            @"@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)",
            @"[?&]q=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)"
        };

        foreach (var pattern in patterns)
        {
            var match = Regex.Match(decodedUrl, pattern);
            if (match.Success)
            {
                return $"{match.Groups[1].Value},{match.Groups[2].Value}";
            }
        }

        return null;
    }

    private static string? ResolveRedirectUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var currentUri))
        {
            return null;
        }

        try
        {
            using var handler = new HttpClientHandler { AllowAutoRedirect = false };
            using var httpClient = new HttpClient(handler) { Timeout = TimeSpan.FromSeconds(5) };

            for (var redirectCount = 0; redirectCount < 6; redirectCount++)
            {
                using var request = new HttpRequestMessage(HttpMethod.Head, currentUri);
                using var response = httpClient.Send(request);

                if ((int)response.StatusCode < 300 || (int)response.StatusCode >= 400 || response.Headers.Location == null)
                {
                    return currentUri.ToString();
                }

                currentUri = response.Headers.Location.IsAbsoluteUri
                    ? response.Headers.Location
                    : new Uri(currentUri, response.Headers.Location);
            }

            return currentUri.ToString();
        }
        catch
        {
            return url;
        }
    }

    private static ServiceResponse Failure(string message)
    {
        return new ServiceResponse
        {
            IsSuccess = false,
            Message = message
        };
    }

    private sealed record VeterinaryClinicValues(
        string Name,
        string City,
        string Address,
        string Phone,
        string[] Services,
        bool Emergency,
        string Description,
        string GoogleMapsUrl,
        string AppleMapsUrl,
        string MapEmbedUrl);
}
