namespace PawMate.BusinessLayer.Structure;

public static class PayPalConfig
{
    public static string ClientId { get; set; } = string.Empty;
    public static string ClientSecret { get; set; } = string.Empty;
    public static string BaseUrl { get; set; } = "https://api-m.sandbox.paypal.com";
    public static string Currency { get; set; } = "EUR";
    public static decimal MdlToPaymentCurrencyRate { get; set; } = 0.05m;

    public static bool IsConfigured =>
        !string.IsNullOrWhiteSpace(ClientId) &&
        !string.IsNullOrWhiteSpace(ClientSecret) &&
        MdlToPaymentCurrencyRate > 0;
}
