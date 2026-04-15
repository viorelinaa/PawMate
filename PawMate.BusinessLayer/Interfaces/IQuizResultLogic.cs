using PawMate.Domain.Models.Quiz;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IQuizResultLogic
{
    ServiceResponse SaveQuizResult(QuizResultCreateDto quizResult);
}
