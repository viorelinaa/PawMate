using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.Adoption;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/adoptions")]
public class AdoptionController : ControllerBase
{
    private readonly IAdoptionLogic _adoptionLogic;

    public AdoptionController()
    {
        var bl = new BusinessLogic();
        _adoptionLogic = bl.GetAdoptionLogic();
    }

    [HttpGet("list")]
    [Authorize(Roles = "admin")]
    public IActionResult GetAdoptionList()
    {
        var response = _adoptionLogic.GetAdoptionList();
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("mine")]
    [Authorize]
    public IActionResult GetMyAdoptionList()
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _adoptionLogic.GetMyAdoptionList(userId.Value);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("received")]
    [Authorize]
    public IActionResult GetReceivedAdoptionList()
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _adoptionLogic.GetReceivedAdoptionList(userId.Value, User.IsInRole("admin"));
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetAdoption([FromRoute] int id)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _adoptionLogic.GetAdoptionById(id, userId.Value, User.IsInRole("admin"));
        if (!response.IsSuccess)
        {
            if (response.Message == "Nu ai dreptul sa vezi aceasta cerere.")
                return StatusCode(StatusCodes.Status403Forbidden, response.Message);

            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpPost("create")]
    [Authorize]
    public IActionResult CreateAdoption([FromBody] AdoptionCreateDto adoption)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _adoptionLogic.CreateAdoption(adoption, userId.Value);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(new { id = response.Data });
    }

    [HttpPut("{id}/status")]
    [Authorize]
    public IActionResult UpdateAdoptionStatus([FromRoute] int id, [FromBody] AdoptionStatusUpdateDto status)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _adoptionLogic.UpdateAdoptionStatus(id, status, userId.Value, User.IsInRole("admin"));
        if (!response.IsSuccess)
        {
            if (response.Message == "Poti modifica doar cererile primite pentru animalele tale.")
                return StatusCode(StatusCodes.Status403Forbidden, response.Message);

            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    private int? GetCurrentUserId()
    {
        var rawUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(rawUserId, out var userId) ? userId : null;
    }
}