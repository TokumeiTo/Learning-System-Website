using LMS.Backend.Data.DbContext;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Auth;
using LMS.Backend.Helpers;
using LMS.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LMS.Backend.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
    {
        // Check if email exists
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            throw new Exception("Email already exists");

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            UserName = dto.Email,
            PasswordHash = PasswordHasher.Instance.Hash(dto.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        // Optionally assign default role
        // var role = await _db.Roles.FirstOrDefaultAsync(r => r.Name == "User");
        // if (role != null)
        //     await _db.UserRoles.AddAsync(new IdentityUserRole<int> { UserId = user.Id, RoleId = role.Id });

        return new AuthResponseDto
        {
            Token = GenerateJwtToken(user),
            FullName = user.FullName,
            Email = user.Email
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.CompanyCode);
        if (user == null || !PasswordHasher.Instance.Verify(dto.Password, user.PasswordHash))
            throw new Exception("Invalid credentials");

        return new AuthResponseDto
        {
            Token = GenerateJwtToken(user),
            FullName = user.FullName,
            Email = user.Email
        };
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim("id", user.Id.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
