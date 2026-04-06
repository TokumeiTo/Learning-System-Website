using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Schedule;

namespace LMS.Backend.Services.Interfaces;

public interface IScheduleService
{
    Task<IEnumerable<SchedulePlanDto>> GetSchedulesForUserAsync(ApplicationUser user, DateTime date);
    Task<IEnumerable<SchedulePlanDto>> GetAllSchedulesForAdminAsync();
    Task CreateScheduleAsync(SchedulePlanUpsertDto dto, string adminId);
    Task UpdateScheduleAsync(Guid id, SchedulePlanUpsertDto dto);
    Task DeleteAsync(Guid id);
}