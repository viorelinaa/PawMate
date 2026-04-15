using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.User;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserLogic _userLogic;

    public UserController()
    {
        var bl = new BusinessLogic();
        _userLogic = bl.GetUserLogic();
    }

    [HttpGet("list")]
    public IActionResult GetUserList()
    {
        var response = _userLogic.GetUserList();
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetUser([FromRoute] int id)
    {
        var response = _userLogic.GetUserById(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("create")]
    public IActionResult CreateUser([FromBody] UserCreateDto user)
    {
        var response = _userLogic.CreateUser(user);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }

    [HttpPut("{id}/status")]
    public IActionResult UpdateUserStatus([FromRoute] int id, [FromBody] UserStatusUpdateDto statusData)
    {
        var response = _userLogic.UpdateUserStatus(id, statusData);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }
}
