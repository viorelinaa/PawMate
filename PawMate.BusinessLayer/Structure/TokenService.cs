namespace PawMate.BusinessLayer.Structure;

public class TokenService
{
    public TokenService() { }

    public string GenerateToken()
    {
        return Guid.NewGuid().ToString();
    }
}
