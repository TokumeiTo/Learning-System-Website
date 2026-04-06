using LMS.Backend.Common;
using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface IScheduleRepository : IBaseRepository<SchedulePlan>
{
    Task<IEnumerable<SchedulePlan>> GetSchedulesForUserAsync(string userId, Position position, string companyCode, DateTime date);
    Task<IEnumerable<SchedulePlan>> GetAllSchedulesAsync();
}