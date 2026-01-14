using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface IUserRepository
{
    Task<ApplicationUser?> GetByCompanyCodeAsync(string companyCode);
    Task<bool> UpdateAsync(ApplicationUser user);
}