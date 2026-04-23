using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.Quiz;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/quiz-results")]
[Authorize]
public class QuizResultController : ControllerBase
{
    private readonly IQuizResultLogic _quizResultLogic;

    public QuizResultController()
    {
        var businessLogic = new BusinessLogic();
        _quizResultLogic = businessLogic.GetQuizResultLogic();
    }

    [HttpPost]
    public IActionResult SaveQuizResult([FromBody] QuizResultCreateDto quizResult)
    {
        var response = _quizResultLogic.SaveQuizResult(quizResult);
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }
}
