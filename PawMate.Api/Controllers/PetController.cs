using System.Security.Claims;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.Pet;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/pets")]
public class PetController : ControllerBase
{
    private const long MaxPetImageBytes = 2 * 1024 * 1024;
    private const long MaxPetImageRequestBytes = 3 * 1024 * 1024;
    private static readonly HashSet<string> AllowedImageContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/png",
        "image/webp"
    };
    private static readonly HashSet<string> AllowedImageExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    };

    private readonly IPetLogic _petLogic;
    private readonly Cloudinary _cloudinary;
    private readonly string _cloudinaryFolder;

    public PetController(IConfiguration configuration)
    {
        var bl = new BusinessLogic();
        _petLogic = bl.GetPetLogic();

        var cloudinarySection = configuration.GetSection("Cloudinary");
        var cloudName = cloudinarySection["CloudName"];
        var apiKey = cloudinarySection["ApiKey"];
        var apiSecret = cloudinarySection["ApiSecret"];

        if (string.IsNullOrWhiteSpace(cloudName) || string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(apiSecret))
        {
            throw new InvalidOperationException("Configuratia Cloudinary lipseste. Seteaza CloudName, ApiKey si ApiSecret.");
        }

        _cloudinary = new Cloudinary(new Account(cloudName, apiKey, apiSecret));
        _cloudinaryFolder = cloudinarySection["Folder"] ?? "pawmate/pets";
    }

    [HttpGet("list")]
    public IActionResult GetPetList([FromQuery] PetQueryDto query)
    {
        var response = _petLogic.GetPetList(query);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetPet([FromRoute] int id)
    {
        var response = _petLogic.GetPetById(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("create")]
    [Authorize]
    public IActionResult CreatePet([FromBody] PetCreateDto pet)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _petLogic.CreatePet(pet, userId.Value);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(new { id = response.Data });
    }

    [HttpPost("{id}/image")]
    [Authorize]
    [RequestSizeLimit(MaxPetImageRequestBytes)]
    public async Task<IActionResult> UploadPetImage([FromRoute] int id, [FromForm] IFormFile? image)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        if (image == null || image.Length == 0)
            return BadRequest("Alege o imagine pentru animal.");

        if (image.Length > MaxPetImageBytes)
            return BadRequest("Imaginea trebuie sa aiba maximum 2 MB.");

        var extension = Path.GetExtension(image.FileName);
        if (!AllowedImageExtensions.Contains(extension) || !AllowedImageContentTypes.Contains(image.ContentType))
            return BadRequest("Sunt permise doar imagini JPG, PNG sau WEBP.");

        await using var stream = image.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(image.FileName, stream),
            Folder = _cloudinaryFolder,
            UseFilename = false,
            UniqueFilename = true,
            Overwrite = false,
            Transformation = new Transformation()
                .Width(1200)
                .Height(1200)
                .Crop("limit")
                .Quality("auto")
                .FetchFormat("auto")
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        if (uploadResult.Error != null)
            return BadRequest($"Cloudinary upload error: {uploadResult.Error.Message}");

        var imageUrl = uploadResult.SecureUrl?.ToString();
        if (string.IsNullOrWhiteSpace(imageUrl))
            return BadRequest("Cloudinary nu a returnat URL-ul imaginii.");

        var imagePublicId = uploadResult.PublicId;
        if (string.IsNullOrWhiteSpace(imagePublicId))
            return BadRequest("Cloudinary nu a returnat PublicId-ul imaginii.");

        var isAdmin = User.IsInRole("admin");
        var response = _petLogic.UpdatePetImage(id, userId.Value, isAdmin, imageUrl, imagePublicId);

        if (!response.IsSuccess)
        {
            if (!string.IsNullOrWhiteSpace(uploadResult.PublicId))
            {
                await _cloudinary.DestroyAsync(new DeletionParams(uploadResult.PublicId) { Invalidate = true });
            }

            if (response.Message == "Poti modifica doar animalele adaugate de tine.")
                return StatusCode(StatusCodes.Status403Forbidden, response.Message);

            return BadRequest(response.Message);
        }

        await DeleteCloudinaryImageAsync(response.Data as PetImageCleanupDto, imagePublicId);

        return Ok(new { imageUrl });
    }

    [HttpPut("{id}")]
    [Authorize]
    public IActionResult UpdatePet([FromRoute] int id, [FromBody] PetUpdateDto pet)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var isAdmin = User.IsInRole("admin");
        var response = _petLogic.UpdatePet(id, pet, userId.Value, isAdmin);
        if (!response.IsSuccess)
        {
            if (response.Message == "Poti modifica doar animalele adaugate de tine.")
                return StatusCode(StatusCodes.Status403Forbidden, response.Message);

            return BadRequest(response.Message);
        }

        return Ok(response.Message);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeletePet([FromRoute] int id)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var isAdmin = User.IsInRole("admin");
        var response = _petLogic.DeletePet(id, userId.Value, isAdmin);
        if (!response.IsSuccess)
        {
            if (response.Message == "Poti sterge doar animalele adaugate de tine.")
                return StatusCode(StatusCodes.Status403Forbidden, response.Message);

            return BadRequest(response.Message);
        }

        await DeleteCloudinaryImageAsync(response.Data as PetImageCleanupDto);

        return Ok(response.Message);
    }

    private async Task DeleteCloudinaryImageAsync(PetImageCleanupDto? image, string? skipPublicId = null)
    {
        var publicId = image?.ImagePublicId;
        if (string.IsNullOrWhiteSpace(publicId))
        {
            publicId = TryExtractCloudinaryPublicId(image?.ImageUrl);
        }

        if (string.IsNullOrWhiteSpace(publicId) || publicId == skipPublicId)
            return;

        try
        {
            await _cloudinary.DestroyAsync(new DeletionParams(publicId) { Invalidate = true });
        }
        catch
        {
            // The database change already succeeded, so Cloudinary cleanup should not break the user request.
        }
    }

    private static string? TryExtractCloudinaryPublicId(string? imageUrl)
    {
        if (string.IsNullOrWhiteSpace(imageUrl) ||
            !Uri.TryCreate(imageUrl, UriKind.Absolute, out var uri) ||
            !uri.Host.EndsWith("cloudinary.com", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var path = uri.AbsolutePath.Trim('/');
        var uploadMarker = "/upload/";
        var uploadIndex = path.IndexOf(uploadMarker.Trim('/'), StringComparison.OrdinalIgnoreCase);
        if (uploadIndex < 0)
            return null;

        var afterUpload = path[(uploadIndex + "upload".Length)..].Trim('/');
        var segments = afterUpload.Split('/', StringSplitOptions.RemoveEmptyEntries).ToList();
        var versionIndex = segments.FindIndex(segment =>
            segment.Length > 1 && segment[0] == 'v' && segment[1..].All(char.IsDigit));

        if (versionIndex >= 0)
        {
            segments = segments.Skip(versionIndex + 1).ToList();
        }

        if (segments.Count == 0)
            return null;

        var publicId = string.Join('/', segments);
        var extension = Path.GetExtension(publicId);
        return string.IsNullOrWhiteSpace(extension) ? publicId : publicId[..^extension.Length];
    }

    private int? GetCurrentUserId()
    {
        var rawUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(rawUserId, out var userId) ? userId : null;
    }
}
