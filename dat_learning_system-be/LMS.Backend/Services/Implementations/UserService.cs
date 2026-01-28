using AutoMapper;
using LMS.Backend.Common;
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.User;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Services.Implement;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly IOrgUnitRepository _unitRepo;
    private readonly IMapper _mapper;

    public UserService(AppDbContext context, IOrgUnitRepository unitRepo, IMapper mapper)
    {
        _context = context;
        _unitRepo = unitRepo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<UserResponseDto>> GetUsersByScopeAsync(string currentUserId)
    {
        var currentUser = await _context.Users.FindAsync(currentUserId);
        if (currentUser == null) return Enumerable.Empty<UserResponseDto>();

        // 1. Initialize query AND Include the Navigation Property
        var query = _context.Users
            .Include(u => u.OrgUnit) // <--- CRITICAL: This ensures OrgUnit is loaded for mapping
            .AsQueryable();

        // APPLY SCOPE LOGIC
        switch (currentUser.Position)
        {
            case Position.SuperAdmin:
                break;

            case Position.DivHead:
                var subUnits = await _unitRepo.GetChildUnitIdsAsync(currentUser.OrgUnitId ?? 0);
                query = query.Where(u => u.OrgUnitId == currentUser.OrgUnitId || subUnits.Contains(u.OrgUnitId ?? 0));
                break;

            case Position.DepHead:
            case Position.SecHead:
            case Position.ProjectManager:
                query = query.Where(u => u.OrgUnitId == currentUser.OrgUnitId);
                break;

            case Position.Employee:
            default:
                query = query.Where(u => u.Id == currentUser.Id);
                break;
        }

        // 2. The mapping now works because u.OrgUnit is no longer null
        var users = await query.ToListAsync();

        return _mapper.Map<IEnumerable<UserResponseDto>>(users);
    }
}