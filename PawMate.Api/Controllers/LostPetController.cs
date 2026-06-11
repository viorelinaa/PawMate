using System.Security.Claims;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.LostPet;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/lost-pets")]
public class LostPetController : ControllerBase
{
    private const long MaxLostPetImageBytes = 2 * 1024 * 1024;
    private const long MaxLostPetImageRequestBytes = 3 * 1024 * 1024;
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

    private readonly ILostPetLogic _lostPetLogic;
    private readonly string? _cloudinaryCloudName;
    private readonly string? _cloudinaryApiKey;
    private readonly string? _cloudinaryApiSecret;
    private readonly string _cloudinaryFolder;

    public LostPetController(IConfiguration configuration)
    {
        var bl = new BusinessLogic();
        _lostPetLogic = bl.GetLostPetLogic();

        var cloudinarySection = configuration.GetSection("Cloudinary");
        _cloudinaryCloudName = cloudinarySection["CloudName"];
        _cloudinaryApiKey = cloudinarySection["ApiKey"];
        _cloudinaryApiSecret = cloudinarySection["ApiSecret"];
        _cloudinaryFolder = cloudinarySection["LostPetsFolder"] ?? cloudinarySection["Folder"] ?? "pawmate/lost-pets";
    }

    [HttpGet("list")]
    public IActionResult GetLostPetList([FromQuery] LostPetQueryDto query)
    {
        var response = _lostPetLogic.GetLostPetList(query);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetLostPet([FromRoute] int id)
    {
        var response = _lostPetLogic.GetLostPetById(id);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpPost("create")]
    [Authorize]
    public IActionResult CreateLostPet([FromBody] LostPetCreateDto lostPet)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _lostPetLogic.CreateLostPet(lostPet, userId.Value);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(new { id = response.Data });
    }

    [HttpPost("{id}/image")]
    [Authorize]
    [RequestSizeLimit(MaxLostPetImageRequestBytes)]
    public async Task<IActionResult> UploadLostPetImage([FromRoute] int id, [FromForm] IFormFile? image)
    {
        var cloudinary = CreateCloudinaryClient();
        if (cloudinary == null)
            return BadRequest("Configuratia Cloudinary lipseste. Seteaza CloudName, ApiKey si ApiSecret.");

        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        if (image == null || image.Length == 0)
            return BadRequest("Alege o imagine pentru anunt.");

        if (image.Length > MaxLostPetImageBytes)
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

        var uploadResult = await cloudinary.UploadAsync(uploadParams);
        if (uploadResult.Error != null)
            return BadRequest($"Cloudinary upload error: {uploadResult.Error.Message}");

        var imageUrl = uploadResult.SecureUrl?.ToString();
        if (string.IsNullOrWhiteSpace(imageUrl))
            return BadRequest("Cloudinary nu a returnat URL-ul imaginii.");

        var imagePublicId = uploadResult.PublicId;
        if (string.IsNullOrWhiteSpace(imagePublicId))
            return BadRequest("Cloudinary nu a returnat PublicId-ul imaginii.");

        var isAdmin = User.IsInRole("admin");
        var response = _lostPetLogic.UpdateLostPetImage(id, userId.Value, isAdmin, imageUrl, imagePublicId);

        if (!response.IsSuccess)
        {
            await cloudinary.DestroyAsync(new DeletionParams(imagePublicId) { Invalidate = true });

            if (response.Message == "Poti modifica doar anunturile adaugate de tine.")
                return StatusCode(StatusCodes.Status403Forbidden, response.Message);

            return BadRequest(response.Message);
        }

        await DeleteCloudinaryImageAsync(response.Data as LostPetImageCleanupDto, imagePublicId, cloudinary);

        return Ok(new { imageUrl });
    }

    [HttpPut("{id}")]
    [Authorize]
    public IActionResult UpdateLostPet([FromRoute] int id, [FromBody] LostPetUpdateDto lostPet)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _lostPetLogic.UpdateLostPet(id, userId.Value, User.IsInRole("admin"), lostPet);
        if (!response.IsSuccess)
        {
            if (response.Message == "Poti modifica doar anunturile adaugate de tine.")
                return StatusCode(StatusCodes.Status403Forbidden, response.Message);

            return BadRequest(response.Message);
        }

        return Ok(response.Message);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteLostPet([FromRoute] int id)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var isAdmin = User.IsInRole("admin");
        var response = _lostPetLogic.DeleteLostPet(id, userId.Value, isAdmin);
        if (!response.IsSuccess)
        {
            if (response.Message == "Poti sterge doar anunturile adaugate de tine.")
                return StatusCode(StatusCodes.Status403Forbidden, response.Message);

            return BadRequest(response.Message);
        }

        await DeleteCloudinaryImageAsync(response.Data as LostPetImageCleanupDto);

        return Ok(response.Message);
    }

    private Cloudinary? CreateCloudinaryClient()
    {
        if (string.IsNullOrWhiteSpace(_cloudinaryCloudName) ||
            string.IsNullOrWhiteSpace(_cloudinaryApiKey) ||
            string.IsNullOrWhiteSpace(_cloudinaryApiSecret))
        {
            return null;
        }

        return new Cloudinary(new Account(_cloudinaryCloudName, _cloudinaryApiKey, _cloudinaryApiSecret));
    }

    private async Task DeleteCloudinaryImageAsync(LostPetImageCleanupDto? image, string? skipPublicId = null, Cloudinary? cloudinary = null)
    {
        var publicId = image?.ImagePublicId;
        if (string.IsNullOrWhiteSpace(publicId))
        {
            publicId = TryExtractCloudinaryPublicId(image?.ImageUrl);
        }

        if (string.IsNullOrWhiteSpace(publicId) || publicId == skipPublicId)
            return;

        cloudinary ??= CreateCloudinaryClient();
        if (cloudinary == null)
            return;

        try
        {
            await cloudinary.DestroyAsync(new DeletionParams(publicId) { Invalidate = true });
        }
        catch
        {
            // The database change already succeeded, so Cloudinary cleanup should not block the request.
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
