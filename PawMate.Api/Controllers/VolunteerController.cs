using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize(Roles = "admin")]
    public IActionResult CreateVolunteer([FromBody] VolunteerCreateDto volunteer)
    {
        var response = _volunteerLogic.CreateVolunteer(volunteer);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }

    [HttpPost("applications")]
    [Authorize]
    public IActionResult CreateVolunteerApplication([FromBody] VolunteerApplicationCreateDto application)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _volunteerLogic.CreateVolunteerApplication(application, userId.Value);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("applications/mine")]
    [Authorize]
    public IActionResult GetMyVolunteerApplications()
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _volunteerLogic.GetMyVolunteerApplications(userId.Value);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("applications/admin")]
    [Authorize(Roles = "admin")]
    public IActionResult GetVolunteerApplicationsForAdmin()
    {
        var response = _volunteerLogic.GetVolunteerApplicationsForAdmin();
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPut("applications/{id}/decision")]
    [Authorize(Roles = "admin")]
    public IActionResult ReviewVolunteerApplication([FromRoute] int id, [FromBody] VolunteerApplicationDecisionDto decision)
    {
        var adminId = GetCurrentUserId();
        if (!adminId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _volunteerLogic.ReviewVolunteerApplication(id, decision, adminId.Value);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    private int? GetCurrentUserId()
    {
        var rawUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(rawUserId, out var userId) ? userId : null;
    }
}
