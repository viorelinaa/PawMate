using PawMate.Domain.Models.BlogPost;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IBlogPostLogic
{
    ServiceResponse CreateBlogPost(BlogPostCreateDto blogPost);
    ServiceResponse GetBlogPostById(int id);
    ServiceResponse GetBlogPostList();
}
