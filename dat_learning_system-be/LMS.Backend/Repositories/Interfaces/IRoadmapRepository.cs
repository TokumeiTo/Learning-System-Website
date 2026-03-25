using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.RoadMap;

namespace LMS.Backend.Repo.Interface;

public interface IRoadmapRepository
{
    Task<IEnumerable<RoadMap>> GetAllAsync();
    Task<RoadMap?> GetByIdAsync(int id);
    Task<RoadMap> CreateAsync(RoadMap roadmap);
    Task UpdateAsync(RoadMap roadmap);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<RoadmapGlobalSourceDto>> SearchResourcesAsync(string searchTerm, string resourceType);
    Task<object?> GetEBookBasicInfoAsync(int id);
    Task<object?> GetCourseBasicInfoAsync(Guid id);
}