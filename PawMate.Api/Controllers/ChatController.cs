using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.Chat;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/chats")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IChatLogic _chatLogic;

    public ChatController()
    {
        var bl = new BusinessLogic();
        _chatLogic = bl.GetChatLogic();
    }

    [HttpGet]
    public IActionResult GetConversations()
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _chatLogic.GetConversations(userId.Value);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("start")]
    public IActionResult StartConversation([FromBody] ChatStartDto dto)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _chatLogic.StartConversation(dto, userId.Value);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("{id}/messages")]
    public IActionResult GetMessages([FromRoute] int id)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _chatLogic.GetMessages(id, userId.Value);
        if (!response.IsSuccess)
        {
            if (response.Message == "Nu ai acces la aceasta conversatie.")
                return StatusCode(StatusCodes.Status403Forbidden, response.Message);

            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpPost("{id}/messages")]
    public IActionResult SendMessage([FromRoute] int id, [FromBody] ChatMessageCreateDto dto)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _chatLogic.SendMessage(id, dto, userId.Value);
        if (!response.IsSuccess)
        {
            if (response.Message == "Nu ai acces la aceasta conversatie.")
                return StatusCode(StatusCodes.Status403Forbidden, response.Message);

            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    private int? GetCurrentUserId()
    {
        var rawUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(rawUserId, out var userId) ? userId : null;
    }
}