using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/statistics")]
[Authorize(Roles = "admin")]
public class StatisticsController : ControllerBase
{
    private readonly IStatisticsLogic _statisticsLogic;

    public StatisticsController()
    {
        var bl = new BusinessLogic();
        _statisticsLogic = bl.GetStatisticsLogic();
    }

    [HttpGet("summary")]
    public IActionResult GetSummary()
    {
        var response = _statisticsLogic.GetSummary();
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }
}
