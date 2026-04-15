namespace PawMate.Domain.Models.Quiz;

public class QuizResultInfoDto
{
    public int Id { get; set; }
    public string AnimalKey { get; set; } = string.Empty;
    public string AnimalName { get; set; } = string.Empty;
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public DateTime CompletedAt { get; set; }
}
