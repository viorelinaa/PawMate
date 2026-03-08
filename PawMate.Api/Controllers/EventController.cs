using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.Event;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/events")]
public class EventController : ControllerBase
{
    private readonly IEventLogic _eventLogic;

    public EventController()
    {
        var bl = new BusinessLogic();
        _eventLogic = bl.GetEventLogic();
    }

    [HttpGet("list")]
    public IActionResult GetEventList()
    {
        var response = _eventLogic.GetEventList();
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetEvent([FromRoute] int id)
    {
        var response = _eventLogic.GetEventById(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("create")]
    public IActionResult CreateEvent([FromBody] EventCreateDto evt)
    {
        var response = _eventLogic.CreateEvent(evt);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }
}
