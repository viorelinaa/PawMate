using PawMate.BusinessLayer.Interfaces;
using PawMate.BusinessLayer.Structure;
using PawMate.Domain.Models.Payment;
using PawMate.Domain.Models.Service;

namespace PawMate.BusinessLayer.Core;

public class PayPalPaymentLogic : PayPalPaymentActions, IPayPalPaymentLogic
{
    public ServiceResponse GetClientConfig()
    {
        return GetClientConfigAction();
    }

    public Task<ServiceResponse> CreateOrderAsync(int userId, PayPalCreateOrderDto request)
    {
        return CreateOrderActionAsync(userId, request);
    }

    public Task<ServiceResponse> CaptureOrderAsync(int userId, string orderId)
    {
        return CaptureOrderActionAsync(userId, orderId);
    }
}
