namespace PawMate.Domain.Models.Payment;

public class PayPalCreateOrderItemDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}
