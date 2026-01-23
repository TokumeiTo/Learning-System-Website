using LMS.Backend.Common;
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class OrgUnitRepository : IOrgUnitRepository
{
    private readonly AppDbContext _context;
    public OrgUnitRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<bool> AddAsync(OrgUnit unit)
    {
        await _context.OrgUnits.AddAsync(unit);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<OrgUnit>> GetAllAsync()
    {
        return await _context.OrgUnits.Include(u => u.Children).ToListAsync();
    }

    public async Task<IEnumerable<OrgUnit>> GetAllTeams()
    {
        return await _context.OrgUnits.Where(u=>u.Level == OrgLevel.Team).ToListAsync();
    }
    public async Task<IEnumerable<OrgUnit>> GetAllDivisions()
    {
        return await _context.OrgUnits.Where(u=>u.Level == OrgLevel.Division).ToListAsync();
    }
    public async Task<IEnumerable<OrgUnit>> GetAllDepartments()
    {
        return await _context.OrgUnits.Where(u=>u.Level == OrgLevel.Department).ToListAsync();
    }
    public async Task<IEnumerable<OrgUnit>> GetAllSections()
    {
        return await _context.OrgUnits.Where(u=>u.Level == OrgLevel.Section).ToListAsync();
    }

    public async Task<OrgUnit?> GetByIdAsync(int id)
    {
        return await _context.OrgUnits.FindAsync(id);
    }

    public async Task<List<int>> GetChildUnitIdsAsync(int parentId)
    {
        return await _context.OrgUnits
            .Where(u => u.ParentId == parentId)
            .Select(u => u.Id).ToListAsync();
    }
}