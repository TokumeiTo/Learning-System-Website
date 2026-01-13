namespace LMS.Backend.Helpers;

public class JwtHelper
{
    private readonly IConfiguration _config;
    public JwtHelper(IConfiguration config) 
    {
        _config = config;
    }
}