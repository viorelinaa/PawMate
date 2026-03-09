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
    public IActionResult GetAdoptionList()
    {
        var response = _adoptionLogic.GetAdoptionList();
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetAdoption([FromRoute] int id)
    {
        var response = _adoptionLogic.GetAdoptionById(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("create")]
    public IActionResult CreateAdoption([FromBody] AdoptionCreateDto adoption)
    {
        var response = _adoptionLogic.CreateAdoption(adoption);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }
}
