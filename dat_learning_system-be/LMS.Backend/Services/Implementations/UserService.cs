using AutoMapper;
using LMS.Backend.Common;
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.User;
using LMS.Backend.Helpers;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

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

    public async Task<IEnumerable<UserResponseDto>> GetUsersByScopeAsync(string currentUserId, int? filterUnitId = null, Position? filterPosition = null)
    {
        var currentUser = await _context.Users
            .Include(u => u.OrgUnit)
            .FirstOrDefaultAsync(u => u.Id == currentUserId);

        if (currentUser == null) return Enumerable.Empty<UserResponseDto>();

        var query = _context.Users.Include(u => u.OrgUnit).AsQueryable();

        // --- SECTION A: SECURITY & SCOPE (Same as before) ---
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
            if (!currentUser.OrgUnitId.HasValue) return Enumerable.Empty<UserResponseDto>();

            var branchIDs = await _unitRepo.GetAllRecursiveChildIds(currentUser.OrgUnitId.Value);
            query = query.Where(u => branchIDs.Contains(u.OrgUnitId ?? 0));
            query = query.Where(u => u.Position != Position.Admin && u.Position != Position.SuperAdmin);
        }

        // Always exclude self
        query = query.Where(u => u.Id != currentUserId);

        // --- SECTION B: DYNAMIC FILTERS ---

        // 1. Filter by specific Unit
        if (filterUnitId.HasValue && filterUnitId.Value > 0)
        {
            query = query.Where(u => u.OrgUnitId == filterUnitId.Value);
        }

        // 2. Filter by Position
        if (filterPosition.HasValue)
        {
            query = query.Where(u => u.Position == filterPosition.Value);
        }

        var users = await query.ToListAsync();
        return _mapper.Map<IEnumerable<UserResponseDto>>(users);
    }

    public async Task<bool> UpdateUserAsync(string id, UserUpdateRequestDto dto)
    {
        // 1. Get the target user
        var targetUser = await _userRepo.GetByIdAsync(id);
        if (targetUser == null) return false;

        // 2. SECURITY CHECK: Ensure the admin is in the same company
        // Get the current admin's company code from the claims/context
        var currentAdminId = _httpContextAccessor.HttpContext?.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var currentAdmin = await _context.Users.FindAsync(currentAdminId);

        // Unless it's a SuperAdmin, they can only edit users within their own company
        if (currentAdmin != null && currentAdmin.Position != Position.SuperAdmin)
        {
            if (targetUser.CompanyCode != currentAdmin.CompanyCode)
            {
                // Throw an exception or return false to prevent cross-company editing
                return false;
            }
        }

        // 3. Set the Audit Reason for the Interceptor
        if (_httpContextAccessor.HttpContext != null)
        {
            _httpContextAccessor.HttpContext.Items["AuditReason"] = dto.UpdatedReason ?? "No reason provided";
        }

        // 4. Update core fields
        targetUser.FullName = dto.FullName;
        targetUser.OrgUnitId = dto.OrgUnitId;

        // 5. Explicit Enum parsing for Position
        // Use Number parsing because Frontend sends "1", "2" etc.
        targetUser.Position = EnumMappingHelper.MapPosition(dto.Position, targetUser.Position);

        // 6. Save changes via repository
        return await _userRepo.UpdateAsync(targetUser);
    }
    public async Task<bool> DeleteUserAsync(string id, UserDeleteRequestDto dto)
    {
        // 1. Fetch target user
        var targetUser = await _userRepo.GetByIdAsync(id);
        if (targetUser == null) return false;

        // 2. SECURITY CHECK: Validate Company Scope
        var currentAdminId = _httpContextAccessor.HttpContext?.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var currentAdmin = await _context.Users.FindAsync(currentAdminId);

        // SuperAdmins are exempt; others must belong to the same company
        if (currentAdmin != null && currentAdmin.Position != Position.SuperAdmin)
        {
            if (targetUser.CompanyCode != currentAdmin.CompanyCode)
            {
                // Security Violation: Attempted to delete user from another company
                return false;
            }
        }

        // 3. Set Audit Reason for Interceptor
        // This is picked up by AuditInterceptor before the record is purged
        if (_httpContextAccessor.HttpContext != null)
        {
            _httpContextAccessor.HttpContext.Items["AuditReason"] = dto.DeletedReason ?? "No reason provided";
        }

        // 4. Execute Deletion
        return await _userRepo.DeleteAsync(targetUser);
    }

    public async Task<UserResponseDto?> GetUserByIdAsync(string id)
    {
        var user = await _userRepo.GetByIdAsync(id);
        if (user == null) return null;

        return _mapper.Map<UserResponseDto>(user);
    }
}