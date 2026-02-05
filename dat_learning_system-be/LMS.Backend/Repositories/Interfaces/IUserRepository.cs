using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface IUserRepository
{
    Task<ApplicationUser?> GetByIdAsync(string id);
    Task<ApplicationUser?> GetByCompanyCodeAsync(string companyCode);
    Task<bool> UpdateAsync(ApplicationUser user);
    Task<bool> DeleteAsync(ApplicationUser user);
}