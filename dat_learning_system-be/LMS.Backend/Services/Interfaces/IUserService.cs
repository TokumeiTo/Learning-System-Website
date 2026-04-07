using LMS.Backend.Common;
using LMS.Backend.Data.Models;
using LMS.Backend.DTOs.User;

namespace LMS.Backend.Services.Interfaces;

public interface IUserService
{
    Task<PaginatedListDto<UserResponseDto>> GetUsersByScopeAsync(
        string currentUserId,
        int? filterUnitId = null,
        Position? filterPosition = null,
        string? search = null,
        int page = 1,
        int pageSize = 10);
    Task<bool> UpdateUserAsync(string id, UserUpdateRequestDto dto);
    Task<bool> DeleteUserAsync(string id, UserDeleteRequestDto dto);
    Task<UserResponseDto?> GetUserByIdAsync(string id);
}