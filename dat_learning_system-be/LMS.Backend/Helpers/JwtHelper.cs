using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LMS.Backend.Data.Entities;
using Microsoft.IdentityModel.Tokens;

namespace LMS.Backend.Helpers;

public class JwtHelper
{
    private readonly IConfiguration _config;
    public JwtHelper(IConfiguration config) 
    {
        _config = config;
    }

    public string GenerateToken(ApplicationUser user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
            new Claim("FullName", user.FullName),
            new Claim("Position", user.Position.ToString()),
            new Claim("OrgUnitId", user.OrgUnitId?.ToString() ?? string.Empty)
        };

        // Add roles to the claims list
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "default_secret_key_32_characters_long"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}