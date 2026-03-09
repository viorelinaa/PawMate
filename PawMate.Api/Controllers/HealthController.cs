using Microsoft.AspNetCore.Mvc;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet("test")]
    public IActionResult Get()
    {
        return Ok("Test");
    }
}
