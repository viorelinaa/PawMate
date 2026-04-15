using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.QuizResult;
using PawMate.Domain.Models.Quiz;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Structure;

public class QuizResultActions
{
    private readonly PawMateDbContext _context;

    public QuizResultActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse SaveQuizResultAction(QuizResultCreateDto quizResult)
    {
        try
        {
            if (quizResult.UserId <= 0)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Utilizatorul asociat rezultatului este invalid."
                };
            }

            if (string.IsNullOrWhiteSpace(quizResult.AnimalKey) || string.IsNullOrWhiteSpace(quizResult.AnimalName))
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Rezultatul quizului este incomplet."
                };
            }

            if (quizResult.TotalQuestions <= 0 || quizResult.Score < 0 || quizResult.Score > quizResult.TotalQuestions)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Scorul quizului este invalid."
                };
            }

            var userExists = _context.Users.Any(user => user.Id == quizResult.UserId);
            if (!userExists)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Utilizatorul nu a fost gasit."
                };
            }

            var entity = new QuizResultEntity
            {
                UserId = quizResult.UserId,
                AnimalKey = quizResult.AnimalKey.Trim(),
                AnimalName = quizResult.AnimalName.Trim(),
                Score = quizResult.Score,
                TotalQuestions = quizResult.TotalQuestions,
                CompletedAt = DateTime.UtcNow
            };

            _context.QuizResults.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Rezultatul quizului a fost salvat cu succes.",
                Data = MapQuizResult(entity)
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la salvarea rezultatului quizului: {ex.Message}"
            };
        }
    }

    private static QuizResultInfoDto MapQuizResult(QuizResultEntity quizResult)
    {
        return new QuizResultInfoDto
        {
            Id = quizResult.Id,
            AnimalKey = quizResult.AnimalKey,
            AnimalName = quizResult.AnimalName,
            Score = quizResult.Score,
            TotalQuestions = quizResult.TotalQuestions,
            CompletedAt = quizResult.CompletedAt
        };
    }
}
