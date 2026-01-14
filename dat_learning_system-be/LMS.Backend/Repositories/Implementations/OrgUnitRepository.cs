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
        return await _context.OrgUnits.Include(u=>u.Children).ToListAsync();
    }

    public async Task<OrgUnit?> GetByIdAsync(int id)
    {
        return await _context.OrgUnits.FindAsync(id);
    }

    public async Task<List<int>> GetChildUnitIdsAsync(int parentId)
    {
        return await _context.OrgUnits
            .Where(u => u.ParentId == parentId)
            .Select(u=>u.Id).ToListAsync();
    }
}