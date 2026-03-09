using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.BlogPost;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/blog")]
public class BlogPostController : ControllerBase
{
    private readonly IBlogPostLogic _blogPostLogic;

    public BlogPostController()
    {
        var bl = new BusinessLogic();
        _blogPostLogic = bl.GetBlogPostLogic();
    }

    [HttpGet("list")]
    public IActionResult GetBlogPostList()
    {
        var response = _blogPostLogic.GetBlogPostList();
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetBlogPost([FromRoute] int id)
    {
        var response = _blogPostLogic.GetBlogPostById(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("create")]
    public IActionResult CreateBlogPost([FromBody] BlogPostCreateDto blogPost)
    {
        var response = _blogPostLogic.CreateBlogPost(blogPost);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }
}
