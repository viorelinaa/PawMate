using PawMate.Domain.Entities.User;

namespace PawMate.Domain.Entities.BlogPost;

public class BlogPostEntity
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public int AuthorId { get; set; }
    public DateTime CreatedAt { get; set; }

    public UserEntity Author { get; set; } = null!;
}
