namespace PawMate.Domain.Models.Sitter;

public class SitterRatingInfoDto
{
    public int SitterId { get; set; }
    public decimal Rating { get; set; }
    public int RatingCount { get; set; }
    public int MyRating { get; set; }
}