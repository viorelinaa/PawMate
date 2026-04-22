namespace PawMate.BusinessLayer.Structure;

public static class JwtConfig
{
    public static string SecretKey { get; set; } = string.Empty;
    public static string Issuer { get; set; } = string.Empty;
    public static string Audience { get; set; } = string.Empty;
    public static int ExpiryMinutes { get; set; } = 60;
}
