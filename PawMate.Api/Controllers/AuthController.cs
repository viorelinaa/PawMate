using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.User;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/session")]
public class AuthController : ControllerBase
{
    private const string RefreshTokenCookieName = "pawmate_refresh";

    private readonly UserActions _userActions = new();

    [HttpPost("auth")]
    [AllowAnonymous]
    public IActionResult Login([FromBody] UserLoginDto loginData)
    {
        var response = _userActions.LoginUserAction(loginData);

        if (!response.IsSuccess)
            return BadRequest(response.Message);

        var result = response.Data as LoginResultDto;
        if (result == null)
            return StatusCode(500, "Eroare internă la procesarea autentificării.");

        Response.Cookies.Append(RefreshTokenCookieName, result.RefreshToken, RefreshTokenCookieOptions());

        return Ok(new
        {
            token = result.Token,
            userId = result.UserId,
            role = result.Role,
            name = result.Name,
            email = result.Email
        });
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public IActionResult Refresh()
    {
        var refreshToken = Request.Cookies[RefreshTokenCookieName];

        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized("Refresh token lipsă.");

        var response = _userActions.RefreshTokenAction(refreshToken);

        if (!response.IsSuccess)
        {
            Response.Cookies.Delete(RefreshTokenCookieName);
            return Unauthorized(response.Message);
        }

        var result = response.Data as RefreshResultDto;
        if (result == null)
            return StatusCode(500, "Eroare internă la reînnoirea token-ului.");

        Response.Cookies.Append(RefreshTokenCookieName, result.RefreshToken, RefreshTokenCookieOptions());

        return Ok(new { token = result.Token });
    }

    [HttpPost("active/{userId}")]
    [Authorize]
    public IActionResult MarkActive(int userId)
    {
        var response = _userActions.MarkUserActiveAction(userId);

        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("logout/{userId}")]
    [Authorize]
    public IActionResult Logout(int userId)
    {
        Response.Cookies.Delete(RefreshTokenCookieName);

        var response = _userActions.MarkUserOfflineAction(userId);

        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    private static CookieOptions RefreshTokenCookieOptions() => new()
    {
        HttpOnly = true,
        SameSite = SameSiteMode.Lax,
        Secure = false,
        MaxAge = TimeSpan.FromDays(7),
        Path = "/"
    };
}
