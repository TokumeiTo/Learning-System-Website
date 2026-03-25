using LMS.Backend.DTOs.RoadMap;

namespace LMS.Backend.Services.Interfaces;

public interface IRoadmapService
{
    Task<IEnumerable<RoadmapResponseDto>> GetRoadmapsAsync();
    Task<RoadmapResponseDto?> GetRoadmapByIdAsync(int id);
    Task<RoadmapResponseDto> CreateRoadmapAsync(RoadmapRequestDto request);
    Task<RoadmapResponseDto?> UpdateRoadmapAsync(int id, RoadmapResponseDto updateDto);
    Task<RoadmapResponseDto?> DuplicateRoadmapAsync(int id);
    Task<bool> DeleteRoadmapAsync(int id);
    Task<IEnumerable<RoadmapGlobalSourceDto>> SearchResourcesAsync(string term, string type);
}