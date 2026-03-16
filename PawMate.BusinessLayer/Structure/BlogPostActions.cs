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
                Message = $"A apărut o eroare la publicarea articolului: {ex.Message}"
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
                    Message = "Articolul de blog nu a fost găsit."
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
                Message = "Articolul de blog a fost găsit.",
                Data = dto
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea articolului: {ex.Message}"
            };
        }
    }

    public ServiceResponse GetBlogPostListAction()
    {
        try
        {
            var list = _context.BlogPosts
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
                Message = "Lista articolelor de blog a fost obținută cu succes.",
                Data = list
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = $"A apărut o eroare la obținerea listei de articole: {ex.Message}"
            };
        }
    }
}
