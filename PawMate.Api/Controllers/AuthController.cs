using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.User;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/session")]
public class AuthController : ControllerBase
{
    private readonly UserActions _userActions = new();

    [HttpPost("auth")]
    public IActionResult Login([FromBody] UserLoginDto loginData)
    {
        var response = _userActions.LoginUserAction(loginData);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }
}
