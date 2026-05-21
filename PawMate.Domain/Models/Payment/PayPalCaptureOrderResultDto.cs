namespace PawMate.Domain.Models.Payment;

public class PayPalCaptureOrderResultDto
{
    public string OrderId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? CaptureId { get; set; }
    public string? CaptureStatus { get; set; }
}
