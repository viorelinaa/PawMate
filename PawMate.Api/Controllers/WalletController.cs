using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PawMate.BusinessLayer;
using PawMate.BusinessLayer.Interfaces;
using PawMate.Domain.Models.Wallet;

namespace PawMate.Api.Controllers;

[ApiController]
[Route("api/wallet")]
[Authorize]
public class WalletController : ControllerBase
{
    private readonly IWalletLogic _walletLogic;

    public WalletController()
    {
        var bl = new BusinessLogic();
        _walletLogic = bl.GetWalletLogic();
    }

    [HttpGet("mine")]
    public async Task<IActionResult> GetMyWallet()
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized("Utilizatorul nu a fost identificat.");

        var response = await _walletLogic.GetMyWalletAsync(userId);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPost("withdrawals")]
    public async Task<IActionResult> CreateWithdrawalRequest([FromBody] WithdrawalRequestCreateDto request)
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized("Utilizatorul nu a fost identificat.");

        var response = await _walletLogic.CreateWithdrawalRequestAsync(userId, request);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPut("payout-account")]
    public async Task<IActionResult> UpdatePayPalSandboxAccount([FromBody] PayPalSandboxAccountUpdateDto account)
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized("Utilizatorul nu a fost identificat.");

        var response = await _walletLogic.UpdatePayPalSandboxAccountAsync(userId, account);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("withdrawals/admin")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetWithdrawalRequestsForAdmin()
    {
        var response = await _walletLogic.GetWithdrawalRequestsForAdminAsync();
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpPut("withdrawals/{id}/decision")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> ReviewWithdrawalRequest(
        [FromRoute] int id,
        [FromBody] WithdrawalRequestDecisionDto decision)
    {
        if (!TryGetCurrentUserId(out var adminId))
            return Unauthorized("Administratorul nu a fost identificat.");

        var response = await _walletLogic.ReviewWithdrawalRequestAsync(id, adminId, decision);
        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    private bool TryGetCurrentUserId(out int userId)
    {
        return int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out userId);
    }
}
