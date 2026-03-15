using Microsoft.AspNetCore.Mvc;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "ok",
            service = "PawMate.Api",
            timestamp = DateTime.UtcNow
        });
    }

    [HttpGet("test")]
    public IActionResult GetTest()
    {
        return Get();
    }
}
