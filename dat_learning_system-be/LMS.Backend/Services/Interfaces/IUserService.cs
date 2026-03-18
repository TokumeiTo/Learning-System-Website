using LMS.Backend.Common;
using LMS.Backend.DTOs.User;

namespace LMS.Backend.Services.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserResponseDto>> GetUsersByScopeAsync(string currentUserId, int? filterUnitId = null, Position? filterPosition = null);
    Task<bool> UpdateUserAsync(string id, UserUpdateRequestDto dto);
    Task<bool> DeleteUserAsync(string id, UserDeleteRequestDto dto);
    Task<UserResponseDto?> GetUserByIdAsync(string id);
}