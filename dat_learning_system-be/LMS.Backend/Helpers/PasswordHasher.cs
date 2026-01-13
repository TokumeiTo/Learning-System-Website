namespace LMS.Backend.Helpers;

public class PasswordHasher
{
    private static PasswordHasher? _instance;
    private PasswordHasher() {}

    public static PasswordHasher Instance => _instance ??= new PasswordHasher();
    public string Hash(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }
    public bool Verify (string password, string hash = null!)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}