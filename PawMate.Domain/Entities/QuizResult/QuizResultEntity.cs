using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.QuizResult;

public class QuizResultEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string AnimalKey { get; set; } = string.Empty;
    public string AnimalName { get; set; } = string.Empty;
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public DateTime CompletedAt { get; set; }

    public UserEntity? User { get; set; }
}
