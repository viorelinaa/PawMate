using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Quiz;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Core;

public class QuizResultLogic : QuizResultActions, IQuizResultLogic
{
    public ServiceResponse SaveQuizResult(QuizResultCreateDto quizResult)
    {
        return SaveQuizResultAction(quizResult);
    }
}
