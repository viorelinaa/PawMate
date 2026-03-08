using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.Volunteer;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/volunteer")]
public class VolunteerController : ControllerBase
{
    private readonly IVolunteerLogic _volunteerLogic;

    public VolunteerController()
    {
        var bl = new BusinessLogic();
        _volunteerLogic = bl.GetVolunteerLogic();
    }

    [HttpGet("list")]
    public IActionResult GetVolunteerList()
    {
        var response = _volunteerLogic.GetVolunteerList();
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetVolunteer([FromRoute] int id)
    {
        var response = _volunteerLogic.GetVolunteerById(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("create")]
    public IActionResult CreateVolunteer([FromBody] VolunteerCreateDto volunteer)
    {
        var response = _volunteerLogic.CreateVolunteer(volunteer);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }
}
