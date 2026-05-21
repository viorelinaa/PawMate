namespace PawMate.Domain.Models.Payment;

public class PayPalClientConfigDto
{
    public string ClientId { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
}
