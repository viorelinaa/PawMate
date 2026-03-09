namespace PawMate.Domain.Models.BlogPost;

public class BlogPostCreateDto
{
    public string Title { get; set; }
    public string Content { get; set; }
    public int AuthorId { get; set; }
}
