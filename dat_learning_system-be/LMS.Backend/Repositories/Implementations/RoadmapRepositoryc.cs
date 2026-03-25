using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using LMS.Backend.DTOs.RoadMap;

namespace LMS.Backend.Repo.Implement;

public class RoadmapRepository(AppDbContext context) : IRoadmapRepository
{
    public async Task<IEnumerable<RoadMap>> GetAllAsync() =>
        await context.RoadMaps.Include(r => r.Steps).OrderBy(r => r.Title).ToListAsync();

    public async Task<RoadMap?> GetByIdAsync(int id) =>
        await context.RoadMaps
            .Include(r => r.Steps.OrderBy(s => s.SortOrder))
            .FirstOrDefaultAsync(r => r.Id == id);

    public async Task<RoadMap> CreateAsync(RoadMap roadmap)
    {
        context.RoadMaps.Add(roadmap);
        await context.SaveChangesAsync();
        return roadmap;
    }

    public async Task UpdateAsync(RoadMap roadmap)
    {
        context.RoadMaps.Update(roadmap);
        await context.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var roadmap = await context.RoadMaps.FindAsync(id);
        if (roadmap == null) return false;
        context.RoadMaps.Remove(roadmap);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<RoadmapGlobalSourceDto>> SearchResourcesAsync(string searchTerm, string resourceType)
    {
        var query = searchTerm.ToLower();

        // 1. If user selected EBook, only search EBooks
        if (resourceType == "EBook")
        {
            return await context.EBooks
                .Where(e => e.Title.ToLower().Contains(query))
                .Select(e => new RoadmapGlobalSourceDto
                {
                    Value = $"EBook - {e.Id}",
                    Title = e.Title,
                    Description = e.Description ?? string.Empty,
                    Type = "EBook"
                })
                .ToListAsync();
        }

        // 2. If user selected Course, only search Courses
        if (resourceType == "Course")
        {
            return await context.Courses
                .Where(c => c.Title.ToLower().Contains(query))
                .Select(c => new RoadmapGlobalSourceDto
                {
                    Value = $"Course - {c.Id}", // Or {c.Url} if you store URLs
                    Title = c.Title,
                    Description = c.Description ?? string.Empty,
                    Type = "Course"
                })
                .ToListAsync();
        }

        return new List<RoadmapGlobalSourceDto>();
    }

    public async Task<object?> GetEBookBasicInfoAsync(int id)
    {
        return await context.EBooks
            .Where(b => b.Id == id)
            .Select(b => new { b.Title, b.Description })
            .FirstOrDefaultAsync();
    }

    public async Task<object?> GetCourseBasicInfoAsync(Guid id)
    {
        return await context.Courses
            .Where(c => c.Id == id)
            .Select(c => new { c.Title, c.Description })
            .FirstOrDefaultAsync();
    }
}