using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.OrgUnit;
using LMS.Backend.Repo.Implement;

namespace LMS.Backend.Services.Interfaces;

public interface IOrgUnitService
{
    Task<IEnumerable<OrgUnitResponseDto>> GetHierarchyAsync();
    Task<IEnumerable<OrgUnitSelectDto>> GetAllTeams();
    Task<IEnumerable<OrgUnitSelectDto>> GetAllDivisions();
    Task<IEnumerable<OrgUnitSelectDto>> GetAllDepartments();
    Task<IEnumerable<OrgUnitSelectDto>> GetAllSections();
    
    Task<bool> CreateUnitAsync(OrgUnitRequestDto dto);
}