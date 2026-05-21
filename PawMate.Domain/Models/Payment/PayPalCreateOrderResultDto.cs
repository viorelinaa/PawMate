namespace PawMate.Domain.Models.Payment;

public class PayPalCreateOrderResultDto
{
    public string OrderId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? ApproveUrl { get; set; }
}
