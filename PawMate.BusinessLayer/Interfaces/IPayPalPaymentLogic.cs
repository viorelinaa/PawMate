using PawMate.Domain.Models.Payment;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Interfaces;

public interface IPayPalPaymentLogic
{
    ServiceResponse GetClientConfig();
    Task<ServiceResponse> CreateOrderAsync(int userId, PayPalCreateOrderDto request);
    Task<ServiceResponse> CaptureOrderAsync(int userId, string orderId);
}
