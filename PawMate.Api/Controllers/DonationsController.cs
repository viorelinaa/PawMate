using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.Donation;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/donations")]
public class DonationsController : ControllerBase
{
    private readonly IDonationLogic _donationLogic;

    public DonationsController()
    {
        var bl = new BusinessLogic();
        _donationLogic = bl.GetDonationLogic();
    }

    [HttpGet("list")]
    public IActionResult GetDonationList()
    {
        var response = _donationLogic.GetDonationList();
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetDonation([FromRoute] int id)
    {
        var response = _donationLogic.GetDonationById(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("create")]
    [Authorize(Roles = "admin")]
    public IActionResult CreateDonation([FromBody] DonationCreateDto dto)
    {
        var response = _donationLogic.CreateDonation(dto);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult UpdateDonation([FromRoute] int id, [FromBody] DonationUpdateDto dto)
    {
        var response = _donationLogic.UpdateDonation(id, dto);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult DeleteDonation([FromRoute] int id)
    {
        var response = _donationLogic.DeleteDonation(id);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Message);
    }
}
