using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Classwork;
using LMS.Backend.DTOs.Schedule;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;


public class ScheduleService(IScheduleRepository repo, IMapper mapper) : IScheduleService
{

    public async Task<IEnumerable<SchedulePlanDto>> GetAllSchedulesForAdminAsync()
    {
        var plans = await repo.GetAllSchedulesAsync();
        return mapper.Map<IEnumerable<SchedulePlanDto>>(plans);
    }
    public async Task CreateScheduleAsync(SchedulePlanUpsertDto dto, string adminId)
    {
        var plan = new SchedulePlan
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            CourseName = dto.CourseName,
            InstructorName = dto.InstructorName,
            ActivityType = dto.ActivityType,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Location = dto.Location,
            Color = dto.Color,
            IsPublic = dto.IsPublic,
            // Convert UI lists to DB strings
            TargetPositions = dto.TargetPositions != null ? string.Join(",", dto.TargetPositions) : null,
            TargetUserCodes = dto.TargetUserCodes != null ? string.Join(",", dto.TargetUserCodes) : null,
            CreatedBy = adminId,
            CreatedAt = DateTime.UtcNow
        };

        await repo.AddAsync(plan);
        await repo.SaveChangesAsync();
    }

    public async Task UpdateScheduleAsync(Guid id, SchedulePlanUpsertDto dto)
    {
        var existing = await repo.GetByIdAsync(id);
        if (existing == null) return;

        // Use AutoMapper or manual assignment
        existing.Title = dto.Title;
        existing.Description = dto.Description;
        existing.CourseName = dto.CourseName;
        existing.InstructorName = dto.InstructorName;
        existing.ActivityType = dto.ActivityType;
        existing.StartTime = dto.StartTime;
        existing.EndTime = dto.EndTime;
        existing.Location = dto.Location;
        existing.Color = dto.Color;
        existing.IsPublic = dto.IsPublic;
        existing.TargetPositions = dto.TargetPositions != null ? string.Join(",", dto.TargetPositions) : null;
        existing.TargetUserCodes = dto.TargetUserCodes != null ? string.Join(",", dto.TargetUserCodes) : null;

        repo.Update(existing); // Sync call from BaseRepo
        await repo.SaveChangesAsync(); // Async save
    }

    public async Task DeleteAsync(Guid id)
    {
        var plan = await repo.GetByIdAsync(id);
        if (plan != null)
        {
            repo.Delete(plan); // Sync call from BaseRepo
            await repo.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<SchedulePlanDto>> GetSchedulesForUserAsync(ApplicationUser user, DateTime date)
    {
        var plans = await repo.GetSchedulesForUserAsync(user.Id, user.Position, user.CompanyCode, date);
        return mapper.Map<IEnumerable<SchedulePlanDto>>(plans);
    }
}