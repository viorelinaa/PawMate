namespace PawMate.Domain.Models.BlogPost;

public class BlogPostQueryDto
{
    public string? Search { get; set; }
    public string? SortBy { get; set; }
    public string? SortDirection { get; set; }
}
