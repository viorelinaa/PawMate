namespace PawMate.Domain.Models.Sitter;

public class SitterQueryDto
{
    public string? Search { get; set; }
    public bool OnlyTopRated { get; set; }
    public decimal? MinRating { get; set; }
    public string? SortBy { get; set; }
    public string? SortDirection { get; set; }
}
