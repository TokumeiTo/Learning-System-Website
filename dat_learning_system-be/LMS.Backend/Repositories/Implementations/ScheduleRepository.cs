using LMS.Backend.Common;
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class ScheduleRepository : BaseRepository<SchedulePlan>, IScheduleRepository
{
    public ScheduleRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<SchedulePlan>> GetSchedulesForUserAsync(string userId, Position position, string companyCode, DateTime date)
    {
        var startOfDay = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);
        var endOfDay = startOfDay.AddDays(1).AddTicks(-1);
        var posString = ((int)position).ToString();

        return await _context.SchedulePlans
            .Where(s => s.StartTime >= startOfDay && s.StartTime <= endOfDay)
            .Where(s =>
                s.IsPublic ||
                (s.TargetPositions != null && s.TargetPositions.Contains(posString)) ||
                (s.TargetUserCodes != null && s.TargetUserCodes.Contains(companyCode))
            )
            .OrderBy(s => s.StartTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<SchedulePlan>> GetAllSchedulesAsync()
    {
        return await _context.SchedulePlans
            .OrderByDescending(s => s.StartTime)
            .ToListAsync();
    }
}