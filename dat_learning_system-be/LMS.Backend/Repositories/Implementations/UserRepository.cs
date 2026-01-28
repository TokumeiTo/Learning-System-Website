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
    
    public async Task<ApplicationUser?> GetByCompanyCodeAsync(string companyCode)
    {
        return await _context.Users
            .Include(u => u.OrgUnit)
            .FirstOrDefaultAsync(u => u.CompanyCode == companyCode);
    }

    public async Task<bool> UpdateAsync(ApplicationUser user)
    {
        _context.Users.Update(user);
        return await _context.SaveChangesAsync() >0;
    }
}