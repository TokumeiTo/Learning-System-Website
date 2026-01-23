using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface IOrgUnitRepository
{
    Task<IEnumerable<OrgUnit>> GetAllAsync();
    Task<IEnumerable<OrgUnit>> GetAllTeams();
    Task<IEnumerable<OrgUnit>> GetAllDivisions();
    Task<IEnumerable<OrgUnit>> GetAllDepartments();
    Task<IEnumerable<OrgUnit>> GetAllSections();
    Task<OrgUnit?> GetByIdAsync(int id);
    Task<bool> AddAsync(OrgUnit unit);
    Task<List<int>> GetChildUnitIdsAsync(int parentId);
}
