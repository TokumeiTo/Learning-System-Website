using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.RoadMap;
using LMS.Backend.Helpers;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class RoadmapService(IRoadmapRepository repo, IMapper mapper) : IRoadmapService
{
    public async Task<IEnumerable<RoadmapResponseDto>> GetRoadmapsAsync()
    {
        var roadmaps = await repo.GetAllAsync();
        return mapper.Map<IEnumerable<RoadmapResponseDto>>(roadmaps);
    }

    public async Task<RoadmapResponseDto?> GetRoadmapByIdAsync(int id)
    {
        var roadmap = await repo.GetByIdAsync(id);
        if (roadmap == null) return null;

        var response = mapper.Map<RoadmapResponseDto>(roadmap);

        // ENRICH STEPS: Fetch Titles/Descriptions for the linked resources
        foreach (var step in response.Steps)
        {
            if (!string.IsNullOrEmpty(step.LinkedResourceId))
            {
                var details = await GetLinkedResourceDetails(step.LinkedResourceId);
                if (details != null)
                {
                    // Use dynamic or reflection to get properties from the anonymous object
                    step.LinkedResourceTitle = details.GetType().GetProperty("Title")?.GetValue(details, null)?.ToString();
                    step.LinkedResourceDescription = details.GetType().GetProperty("Description")?.GetValue(details, null)?.ToString();
                }
            }
        }

        return response;
    }

    // Admin: Create Roadmap
    public async Task<RoadmapResponseDto> CreateRoadmapAsync(RoadmapRequestDto request)
    {
        var roadmap = mapper.Map<RoadMap>(request);
        var created = await repo.CreateAsync(roadmap);
        return mapper.Map<RoadmapResponseDto>(created);
    }

    public async Task<RoadmapResponseDto?> UpdateRoadmapAsync(int id, RoadmapResponseDto updateDto)
    {
        // Use the repo to get the existing entity including steps
        var existingRoadmap = await repo.GetByIdAsync(id);
        if (existingRoadmap == null) return null;

        // 1. Update Header Information
        existingRoadmap.Title = updateDto.Title;
        existingRoadmap.Description = updateDto.Description;
        existingRoadmap.TargetRole = updateDto.TargetRole;

        // 2. Sync Steps (Manual "Check -> Update/Add/Delete" Logic)
        var incomingStepIds = updateDto.Steps.Select(s => s.Id).ToList();

        // A. Remove steps that are no longer present in the updateDto
        var stepsToRemove = existingRoadmap.Steps
            .Where(s => !incomingStepIds.Contains(s.Id))
            .ToList();

        foreach (var step in stepsToRemove)
        {
            existingRoadmap.Steps.Remove(step);
        }

        // B. Update existing steps or Add new ones
        foreach (var stepDto in updateDto.Steps)
        {
            // Format the ID to "EBook - 1" or "Course - GUID"
            var formattedLinkedId = FormatResourceId(stepDto.NodeType, stepDto.LinkedResourceId);

            var existingStep = existingRoadmap.Steps
                .FirstOrDefault(s => s.Id == stepDto.Id && s.Id != 0);

            if (existingStep != null)
            {
                // UPDATE existing step
                existingStep.Title = stepDto.Title;
                existingStep.NodeType = stepDto.NodeType;
                existingStep.Content = stepDto.Content;
                existingStep.LinkedResourceId = formattedLinkedId;
                existingStep.SortOrder = stepDto.SortOrder;
            }
            else
            {
                // ADD new step
                existingRoadmap.Steps.Add(new RoadmapStep
                {
                    Title = stepDto.Title,
                    NodeType = stepDto.NodeType,
                    Content = stepDto.Content,
                    LinkedResourceId = formattedLinkedId,
                    SortOrder = stepDto.SortOrder,
                    RoadMapId = existingRoadmap.Id
                });
            }
        }

        // 3. Persist changes
        await repo.UpdateAsync(existingRoadmap);

        // 4. Map back to Response DTO
        return mapper.Map<RoadmapResponseDto>(existingRoadmap);
    }

    /// <summary>
    /// Ensures the LinkedResourceId is stored as "NodeType - RawId"
    /// Example: "EBook - 5" or "Course - 267ae2c0..."
    /// </summary>
    private string? FormatResourceId(string nodeType, string? inputId)
    {
        if (string.IsNullOrWhiteSpace(inputId)) return null;

        // If it's already formatted correctly, return as is
        if (inputId.Contains(" - ")) return inputId;

        // Otherwise, prefix it with the NodeType
        return $"{nodeType} - {inputId}";
    }

    public async Task<RoadmapResponseDto?> DuplicateRoadmapAsync(int id)
    {
        var original = await repo.GetByIdAsync(id);
        if (original == null) return null;

        // Create a deep copy
        var duplicate = new RoadMap
        {
            Title = $"{original.Title} (Copy)",
            Description = original.Description,
            TargetRole = original.TargetRole,
            CreatedAt = DateTime.UtcNow,
            Steps = original.Steps.Select(s => new RoadmapStep
            {
                Title = s.Title,
                NodeType = s.NodeType,
                Content = s.Content,
                LinkedResourceId = s.LinkedResourceId,
                SortOrder = s.SortOrder
            }).ToList()
        };

        var created = await repo.CreateAsync(duplicate);
        return mapper.Map<RoadmapResponseDto>(created);
    }

    public async Task<bool> DeleteRoadmapAsync(int id)
    {
        return await repo.DeleteAsync(id);
    }

    public async Task<object?> GetLinkedResourceDetails(string linkedResourceId)
    {
        var (type, rawId) = RoadmapResourceHelper.ParseResourceId(linkedResourceId);
        if (type == "None") return null;

        return type switch
        {
            "EBook" => await repo.GetEBookBasicInfoAsync(int.Parse(rawId)), // Better to call repo
            "Course" => await repo.GetCourseBasicInfoAsync(Guid.Parse(rawId)),
            _ => null
        };
    }

    public async Task<IEnumerable<RoadmapGlobalSourceDto>> SearchResourcesAsync(string term,string type)
    {
        // Simply pass the call to the repository we updated earlier
        return await repo.SearchResourcesAsync(term, type);
    }
}