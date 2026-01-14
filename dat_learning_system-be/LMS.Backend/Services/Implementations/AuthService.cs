using LMS.Backend.DTOs.Auth;
using LMS.Backend.Services.Interfaces;
using LMS.Backend.Repo.Interface;
using Microsoft.AspNetCore.Identity;
using LMS.Backend.Data.Entities;
using LMS.Backend.Helpers;
using LMS.Backend.Common;
using AutoMapper;


namespace LMS.Backend.Services.Implement;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtHelper _jwtHelper;
    private readonly IMapper _mapper;

    public AuthService(
        IUserRepository userRepository,
        UserManager<ApplicationUser> userManager,
        JwtHelper jwtHelper,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _userManager = userManager;
        _jwtHelper = jwtHelper;
        _mapper = mapper;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto)
    {
        var user = await _userRepository.GetByCompanyCodeAsync(dto.CompanyCode);
        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            return default;

        // Fetch the roles assigned to this user from the AspNetUserRoles table
        var roles = await _userManager.GetRolesAsync(user);

        var token = _jwtHelper.GenerateToken(user, roles);

        var response = _mapper.Map<LoginResponseDto>(user);
        response.Token = token;
        return response;
    }

    public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto dto)
    {
        // 1. Create the ApplicationUser object
        var user = _mapper.Map<ApplicationUser>(dto);

        // 2. Use Identity's UserManager to create the user and hash the password
        var result = await _userManager.CreateAsync(user, dto.Password);

        if (result.Succeeded)
        {
            // Inside RegisterAsync, change roleName logic:
            string roleName = dto.Position switch
            {
                Position.SuperAdmin => "SuperAdmin",
                Position.HR => "HR",
                _ => "Staff" // Everyone else (DivHead, DepHead, etc.) gets "Staff" role for security
            };

            await _userManager.AddToRoleAsync(user, roleName);

            return new RegisterResponseDto
            {
                IsSuccess = true,
                Message = "User registered successfully",
                CompanyCode = user.CompanyCode,
                UserPosition = user.Position.ToString()
            };
        }

        var error = result.Errors.FirstOrDefault()?.Description ?? "Registration failed";
        return new RegisterResponseDto { IsSuccess = false, Message = error };
    }
}