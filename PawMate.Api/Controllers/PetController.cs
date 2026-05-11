using System.Security.Claims;
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
    private readonly IPetLogic _petLogic;

    public PetController()
    {
        var bl = new BusinessLogic();
        _petLogic = bl.GetPetLogic();
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

        return Ok(response.Message);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult UpdatePet([FromRoute] int id, [FromBody] PetUpdateDto pet)
    {
        var response = _petLogic.UpdatePet(id, pet);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeletePet([FromRoute] int id)
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

        return Ok(response.Message);
    }

    private int? GetCurrentUserId()
    {
        var rawUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(rawUserId, out var userId) ? userId : null;
    }
}