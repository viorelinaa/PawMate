using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.Sitter;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/sitters")]
public class SitterController : ControllerBase
{
    private readonly ISitterLogic _sitterLogic;

    public SitterController()
    {
        var bl = new BusinessLogic();
        _sitterLogic = bl.GetSitterLogic();
    }

    [HttpGet("list")]
    public IActionResult GetSitterList([FromQuery] SitterQueryDto query)
    {
        var response = _sitterLogic.GetSitterList(query);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetSitter([FromRoute] int id)
    {
        var response = _sitterLogic.GetSitterById(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("create")]
    [Authorize]
    public IActionResult CreateSitter([FromBody] SitterCreateDto sitter)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _sitterLogic.CreateSitter(sitter, userId.Value);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }

    [HttpPut("{id}")]
    [Authorize]
    public IActionResult UpdateSitter([FromRoute] int id, [FromBody] SitterUpdateDto sitter)
    {
        var response = _sitterLogic.UpdateSitter(id, sitter);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteSitter([FromRoute] int id)
    {
        var response = _sitterLogic.DeleteSitter(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }


    [HttpPost("{id}/rating")]
    [Authorize]
    public IActionResult RateSitter([FromRoute] int id, [FromBody] SitterRatingCreateDto rating)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized("Utilizatorul nu este autentificat.");

        var response = _sitterLogic.RateSitter(id, rating, userId.Value);
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
