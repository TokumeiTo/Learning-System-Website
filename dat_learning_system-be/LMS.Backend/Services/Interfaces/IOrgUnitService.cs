using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.OrgUnit;
using LMS.Backend.Repo.Implement;

namespace LMS.Backend.Services.Interfaces;

public interface IOrgUnitService
{
    Task<IEnumerable<OrgUnitResponseDto>> GetHierarchyAsync();
    Task<bool> CreateUnitAsync(OrgUnitRequestDto dto);
}