using PawMate.Domain.Models.Payment;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IPayPalPaymentLogic
{
    ServiceResponse GetClientConfig();
    Task<ServiceResponse> CreateOrderAsync(PayPalCreateOrderDto request);
    Task<ServiceResponse> CaptureOrderAsync(string orderId);
}
