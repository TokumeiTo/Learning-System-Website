using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;
    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApplicationUser?> GetByIdAsync(string id)
    {
        return await _context.Users
            .Include(u => u.OrgUnit)
            .FirstOrDefaultAsync(u => u.Id == id);
    }
    public async Task<List<string>> GetAdminUserIdsAsync()
    {
        // Assuming Position is your Enum and 1=Admin, 2=SuperAdmin 
        // Adjust based on your actual Enum names
        return await _context.Users
            .Where(u => u.Position == Common.Position.Admin || u.Position == Common.Position.SuperAdmin)
            .Select(u => u.Id)
            .ToListAsync();
    }

    public async Task<ApplicationUser?> GetByCompanyCodeAsync(string companyCode)
    {
        return await _context.Users
            .Include(u => u.OrgUnit)
            .FirstOrDefaultAsync(u => u.CompanyCode == companyCode);
    }

    public async Task<bool> UpdateAsync(ApplicationUser user)
    {
        _context.Users.Update(user);
        return await _context.SaveChangesAsync() > 0;
    }
    public async Task<bool> DeleteAsync(ApplicationUser user)
    {
        _context.Users.Remove(user);
        return await _context.SaveChangesAsync() > 0;
    }
}