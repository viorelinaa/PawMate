using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.Marketplace;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/marketplace")]
public class MarketplaceController : ControllerBase
{
    private readonly IMarketplaceLogic _marketplaceLogic;

    public MarketplaceController()
    {
        var bl = new BusinessLogic();
        _marketplaceLogic = bl.GetMarketplaceLogic();
    }

    [HttpGet("list")]
    public IActionResult GetListingList()
    {
        var response = _marketplaceLogic.GetListingList();
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetListing([FromRoute] int id)
    {
        var response = _marketplaceLogic.GetListingById(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("create")]
    [Authorize]
    public IActionResult CreateListing([FromBody] MarketplaceCreateDto listing)
    {
        var response = _marketplaceLogic.CreateListing(listing);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }

    [HttpPut("{id}")]
    [Authorize]
    public IActionResult UpdateListing([FromRoute] int id, [FromBody] MarketplaceUpdateDto listing)
    {
        var response = _marketplaceLogic.UpdateListing(id, listing);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteListing([FromRoute] int id)
    {
        var response = _marketplaceLogic.DeleteListing(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }
}
