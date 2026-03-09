using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Models.BlogPost;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Structure;

public class BlogPostActions
{
    private readonly PawMateDbContext _context;

    public BlogPostActions()
    {
        _context = new PawMateDbContext();
    }

    public ServiceResponse CreateBlogPostAction(BlogPostCreateDto blogPost)
    {
        throw new NotImplementedException();
    }

    public ServiceResponse GetBlogPostByIdAction(int id)
    {
        throw new NotImplementedException();
    }

    public ServiceResponse GetBlogPostListAction()
    {
        throw new NotImplementedException();
    }
}
