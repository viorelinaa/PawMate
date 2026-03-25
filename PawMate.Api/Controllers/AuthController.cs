using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.User;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/session")]
public class AuthController : ControllerBase
{
    private readonly IUserAuthLogic _userAuthLogic;

    public AuthController()
    {
        var bl = new BusinessLogic();
        _userAuthLogic = bl.GetUserAuthLogic();
    }

    [HttpPost("auth")]
    public IActionResult Auth([FromBody] UserLoginDto loginData)
    {
        var response = _userAuthLogic.Login(loginData);
        if (!response.IsSuccess)
            return Unauthorized(response.Message);

        return Ok(response.Data);
    }
}
