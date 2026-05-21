using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.Payment;
using System.Security.Claims;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/paypal")]
public class PayPalController : ControllerBase
{
    private readonly IPayPalPaymentLogic _payPalPaymentLogic;

    public PayPalController()
    {
        var bl = new BusinessLogic();
        _payPalPaymentLogic = bl.GetPayPalPaymentLogic();
    }

    [HttpGet("client-config")]
    public IActionResult GetClientConfig()
    {
        var response = _payPalPaymentLogic.GetClientConfig();
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("create-order")]
    [Authorize]
    public async Task<IActionResult> CreateOrder([FromBody] PayPalCreateOrderDto request)
    {
        if (!TryGetAuthenticatedUserId(out var userId))
            return Unauthorized("Utilizatorul nu a fost identificat.");

        var response = await _payPalPaymentLogic.CreateOrderAsync(userId, request);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("capture-order/{orderId}")]
    [Authorize]
    public async Task<IActionResult> CaptureOrder([FromRoute] string orderId)
    {
        if (!TryGetAuthenticatedUserId(out var userId))
            return Unauthorized("Utilizatorul nu a fost identificat.");

        var response = await _payPalPaymentLogic.CaptureOrderAsync(userId, orderId);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    private bool TryGetAuthenticatedUserId(out int userId)
    {
        var claimValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claimValue, out userId);
    }
}
