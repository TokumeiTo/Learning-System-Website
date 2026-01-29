using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface ICourseRepository: IBaseRepository<Course>
{
    Task<Course?> GetFullClassroomDetailsAsync(Guid courseId);
    
}