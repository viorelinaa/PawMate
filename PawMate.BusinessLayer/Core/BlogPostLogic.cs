using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.BlogPost;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Core;

public class BlogPostLogic : BlogPostActions, IBlogPostLogic
{
    public ServiceResponse CreateBlogPost(BlogPostCreateDto blogPost)
    {
        return CreateBlogPostAction(blogPost);
    }

    public ServiceResponse GetBlogPostById(int id)
    {
        return GetBlogPostByIdAction(id);
    }

    public ServiceResponse GetBlogPostList(BlogPostQueryDto query)
    {
        return GetBlogPostListAction(query);
    }
}
