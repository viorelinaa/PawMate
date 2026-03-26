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
    public IActionResult GetPetList()
    {
        var response = _petLogic.GetPetList();
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
    public IActionResult CreatePet([FromBody] PetCreateDto pet)
    {
        var response = _petLogic.CreatePet(pet);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }

    [HttpPut("{id}")]
    public IActionResult UpdatePet([FromRoute] int id, [FromBody] PetUpdateDto pet)
    {
        var response = _petLogic.UpdatePet(id, pet);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }

    [HttpDelete("{id}")]
    public IActionResult DeletePet([FromRoute] int id)
    {
        var response = _petLogic.DeletePet(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }
}
