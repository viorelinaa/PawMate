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
    public IActionResult GetLostPetList()
    {
        var response = _lostPetLogic.GetLostPetList();
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
    public IActionResult CreateLostPet([FromBody] LostPetCreateDto lostPet)
    {
        var response = _lostPetLogic.CreateLostPet(lostPet);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Message);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateLostPet([FromRoute] int id, [FromBody] LostPetUpdateDto lostPet)
    {
        var response = _lostPetLogic.UpdateLostPet(id, lostPet);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Message);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteLostPet([FromRoute] int id)
    {
        var response = _lostPetLogic.DeleteLostPet(id);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Message);
    }
}
