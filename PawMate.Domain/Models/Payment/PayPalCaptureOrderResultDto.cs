namespace PawMate.Domain.Models.Payment;

public class PayPalCaptureOrderResultDto
{
    public int InternalOrderId { get; set; }
    public string OrderId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? CaptureId { get; set; }
    public string? CaptureStatus { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
}
