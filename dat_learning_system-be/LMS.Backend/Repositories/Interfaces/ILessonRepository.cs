using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface ILessonRepository : IBaseRepository<Lesson>
{
    Task<Lesson> CreateLessonAsync(Lesson lesson);
    Task UpdateLessonAsync(Lesson lesson);
    Task DeleteLessonAsync(Guid lessonId);
    Task<Course?> GetClassroomStructureAsync(Guid courseId);
    Task<int> GetNextSortOrderAsync(Guid courseId);
    Task ReOrderLessonsAsync(Guid courseId, List<Guid> lessonIds);
    Task SaveLessonContentsAsync(Guid lessonId, IEnumerable<LessonContent> contents);
    Task<double> GetAverageScoreForLessonAsync(Guid lessonId);

}