using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.ProfileAvatar;
using PawMate.Domain.Models.User;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly UserActions _userActions = new();

    [HttpGet("{id}")]
    [AllowAnonymous]
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

    [HttpGet("avatars")]
    [AllowAnonymous]
    public IActionResult GetAvatarOptions()
    {
        var response = _userActions.GetProfileAvatarOptionsAction();
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpPost("avatars")]
    [Authorize(Roles = "admin")]
    public IActionResult CreateAvatarOption([FromBody] ProfileAvatarCreateDto avatarData)
    {
        var response = _userActions.CreateProfileAvatarOptionAction(avatarData);
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpPut("{id}/avatar")]
    public IActionResult UpdateProfileAvatar(int id, [FromBody] UserProfileAvatarUpdateDto avatarData)
    {
        var response = _userActions.SetUserProfileAvatarAction(id, avatarData);
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }
}
