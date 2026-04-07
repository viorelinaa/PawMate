using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.User;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/reg")]
public class RegisterController : ControllerBase
{
    private readonly UserActions _userActions = new();

    [HttpPost("register")]
    public IActionResult Register([FromBody] UserCreateDto registerData)
    {
        var response = _userActions.CreateUserAction(registerData);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Message);
    }
}
