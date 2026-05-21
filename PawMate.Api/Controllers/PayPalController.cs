using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.Payment;

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
        var response = await _payPalPaymentLogic.CreateOrderAsync(request);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("capture-order/{orderId}")]
    [Authorize]
    public async Task<IActionResult> CaptureOrder([FromRoute] string orderId)
    {
        var response = await _payPalPaymentLogic.CaptureOrderAsync(orderId);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }
}
