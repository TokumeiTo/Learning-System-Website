using AutoMapper;
using LMS.Backend.Common;
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.User;
using LMS.Backend.Helpers;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using LMS.Backend.Data.Models;

namespace LMS.Backend.Services.Implement;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly IUserRepository _userRepo;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IOrgUnitRepository _unitRepo;
    private readonly IMapper _mapper;

    public UserService(
        AppDbContext context,
        IOrgUnitRepository unitRepo,
        IMapper mapper,
        IUserRepository userRepo,
        IHttpContextAccessor httpContextAccessor
    )
    {
        _context = context;
        _unitRepo = unitRepo;
        _mapper = mapper;
        _userRepo = userRepo;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<PaginatedListDto<UserResponseDto>> GetUsersByScopeAsync(
      string currentUserId,
      int? filterUnitId = null,
      Position? filterPosition = null,
      string? search = null,
      int page = 1,
      int pageSize = 10)
    {
        var currentUser = await _context.Users
            .Include(u => u.OrgUnit)
            .FirstOrDefaultAsync(u => u.Id == currentUserId);

        if (currentUser == null) return new PaginatedListDto<UserResponseDto>();

        var query = _context.Users.Include(u => u.OrgUnit).AsQueryable();

        // --- SECTION A: SECURITY & SCOPE ---
        bool isGlobalManager = currentUser.Position == Position.Admin ||
                               currentUser.Position == Position.SuperAdmin ||
                               currentUser.OrgUnitId == 1;

        if (isGlobalManager)
        {
            if (currentUser.Position != Position.SuperAdmin)
            {
                query = query.Where(u => u.Position != Position.SuperAdmin);
            }
        }
        else
        {
            if (!currentUser.OrgUnitId.HasValue) return new PaginatedListDto<UserResponseDto>();

            var branchIDs = await _unitRepo.GetAllRecursiveChildIds(currentUser.OrgUnitId.Value);
            query = query.Where(u => branchIDs.Contains(u.OrgUnitId ?? 0));
            query = query.Where(u => u.Position != Position.Admin && u.Position != Position.SuperAdmin);
        }

        // --- SECTION B: DYNAMIC FILTERS ---
        if (!string.IsNullOrWhiteSpace(search))
        {
            string lowerSearch = search.ToLower();
            query = query.Where(u =>
                u.FullName.ToLower().Contains(lowerSearch) ||
                u.Email!.ToLower().Contains(lowerSearch) ||
                u.CompanyCode.ToLower().Contains(lowerSearch));
        }

        if (filterUnitId.HasValue && filterUnitId.Value > 0)
        {
            query = query.Where(u => u.OrgUnitId == filterUnitId.Value);
        }

        if (filterPosition.HasValue)
        {
            query = query.Where(u => u.Position == filterPosition.Value);
        }

        // --- SECTION C: PAGINATION ---
        // 1. Get the total count before slicing the data
        var totalCount = await query.CountAsync();

        // 2. Fetch the specific "slice" for the current page
        var users = await query
            .OrderBy(u => u.FullName) // Essential for consistent pagination
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedListDto<UserResponseDto>
        {
            Items = _mapper.Map<IEnumerable<UserResponseDto>>(users),
            TotalCount = totalCount
        };
    }

    public async Task<bool> UpdateUserAsync(string id, UserUpdateRequestDto dto)
    {
        // 1. Fetch target
        var targetUser = await _userRepo.GetByIdAsync(id);
        if (targetUser == null) return false;

        // 2. SECURITY CHECK: Ensure the actor is authorized (Admin or SuperAdmin)
        var currentAdminId = _httpContextAccessor.HttpContext?.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var currentAdmin = await _context.Users.FindAsync(currentAdminId);

        // If for some reason a non-admin hit this, block them
        if (currentAdmin == null || (currentAdmin.Position != Position.SuperAdmin && currentAdmin.Position != Position.Admin))
        {
            return false;
        }

        // 3. Set Audit Reason for Interceptor
        if (_httpContextAccessor.HttpContext != null)
        {
            _httpContextAccessor.HttpContext.Items["AuditReason"] = dto.UpdatedReason ?? "No reason provided";
        }

        // 4. Update core fields
        targetUser.FullName = dto.FullName;
        targetUser.OrgUnitId = dto.OrgUnitId;

        // 5. Update Position
        targetUser.Position = EnumMappingHelper.MapPosition(dto.Position, targetUser.Position);

        // 6. Save
        return await _userRepo.UpdateAsync(targetUser);
    }

    public async Task<bool> DeleteUserAsync(string id, UserDeleteRequestDto dto)
    {
        // 1. Fetch target
        var targetUser = await _userRepo.GetByIdAsync(id);
        if (targetUser == null) return false;

        // 2. SECURITY CHECK
        var currentAdminId = _httpContextAccessor.HttpContext?.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var currentAdmin = await _context.Users.FindAsync(currentAdminId);

        if (currentAdmin == null || (currentAdmin.Position != Position.SuperAdmin && currentAdmin.Position != Position.Admin))
        {
            return false;
        }

        // 3. Set Audit Reason
        if (_httpContextAccessor.HttpContext != null)
        {
            _httpContextAccessor.HttpContext.Items["AuditReason"] = dto.DeletedReason ?? "No reason provided";
        }

        // 4. Execute
        return await _userRepo.DeleteAsync(targetUser);
    }
    
    public async Task<UserResponseDto?> GetUserByIdAsync(string id)
    {
        var user = await _userRepo.GetByIdAsync(id);
        if (user == null) return null;

        return _mapper.Map<UserResponseDto>(user);
    }
}