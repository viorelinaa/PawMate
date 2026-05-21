namespace PawMate.Domain.Models.Payment;

public class PayPalCreateOrderDto
{
    public List<PayPalCreateOrderItemDto> Items { get; set; } = new();
}
