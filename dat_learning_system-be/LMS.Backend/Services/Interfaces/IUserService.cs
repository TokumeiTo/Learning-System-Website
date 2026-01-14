using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.User;

namespace LMS.Backend.Services.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserResponseDto>> GetUsersByScopeAsync(string currentUserId);
}