using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.User;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly UserActions _userActions = new();

    [HttpGet("{id}")]
    public IActionResult GetProfile(int id)
    {
        var response = _userActions.GetUserProfileAction(id);

        if (!response.IsSuccess)
        {
            return NotFound(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateProfile(int id, [FromBody] UserProfileUpdateDto profileData)
    {
        var response = _userActions.UpdateUserProfileAction(id, profileData);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }
}
