using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface ILessonRepository
{
    Task<Course?> GetClassroomStructureAsync(Guid courseId);
}