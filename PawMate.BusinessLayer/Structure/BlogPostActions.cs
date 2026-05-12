using Microsoft.EntityFrameworkCore;
using PawMate.DataAccessLayer.Context;
using PawMate.Domain.Entities.BlogPost;
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
        try
        {
            var entity = new BlogPostEntity
            {
                Title = blogPost.Title,
                Content = blogPost.Content,
                AuthorId = blogPost.AuthorId,
                CreatedAt = DateTime.UtcNow
            };

            _context.BlogPosts.Add(entity);
            _context.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Articolul de blog a fost publicat cu succes.",
                Data = entity.Id
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la publicarea articolului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetBlogPostByIdAction(int id)
    {
        try
        {
            var entity = _context.BlogPosts.FirstOrDefault(b => b.Id == id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Articolul de blog nu a fost gasit."
                };
            }

            var dto = new BlogPostInfoDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Content = entity.Content,
                AuthorId = entity.AuthorId,
                CreatedAt = entity.CreatedAt
            };

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Articolul de blog a fost gasit.",
                Data = dto
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea articolului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetBlogPostListAction(BlogPostQueryDto query)
    {
        try
        {
            var blogPostsQuery = _context.BlogPosts.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var search = query.Search.Trim().ToLower();
                blogPostsQuery = blogPostsQuery.Where(b =>
                    b.Title.ToLower().Contains(search) ||
                    b.Content.ToLower().Contains(search));
            }

            blogPostsQuery = query.SortBy?.ToLower() switch
            {
                "title" when query.SortDirection == "desc" => blogPostsQuery.OrderByDescending(b => b.Title),
                "title" => blogPostsQuery.OrderBy(b => b.Title),
                "createdat" when query.SortDirection == "asc" => blogPostsQuery.OrderBy(b => b.CreatedAt),
                _ => blogPostsQuery.OrderByDescending(b => b.CreatedAt)
            };

            var list = blogPostsQuery
                .Select(b => new BlogPostInfoDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    AuthorId = b.AuthorId,
                    CreatedAt = b.CreatedAt
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Lista articolelor de blog a fost obtinuta cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A aparut o eroare la obtinerea listei de articole: {ex.Message}"
            };
        }
    }
}