using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface IOrgUnitRepository
{
    Task<IEnumerable<OrgUnit>> GetAllAsync();
    Task<OrgUnit?> GetByIdAsync(int id);
    Task<bool> AddAsync(OrgUnit unit);
    Task<List<int>> GetChildUnitIdsAsync(int parentId);
}
