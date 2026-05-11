using System.Security.Claims;
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
    private readonly ILostPetLogic _lostPetLogic;

    public LostPetController()
    {
        var bl = new BusinessLogic();
        _lostPetLogic = bl.GetLostPetLogic();
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
        return Ok(response.Message);
    }

    [HttpPut("{id}")]
    [Authorize]
    public IActionResult UpdateLostPet([FromRoute] int id, [FromBody] LostPetUpdateDto lostPet)
    {
        var response = _lostPetLogic.UpdateLostPet(id, lostPet);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Message);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteLostPet([FromRoute] int id)
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

        return Ok(response.Message);
    }

    private int? GetCurrentUserId()
    {
        var rawUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(rawUserId, out var userId) ? userId : null;
    }
}