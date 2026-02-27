using LMS.Backend.DTOs.Classroom;
using LMS.Backend.DTOs.Lesson;

namespace LMS.Backend.Services.Interfaces;

public interface ILessonService
{
    Task<ClassroomViewDto?> GetClassroomViewAsync(Guid courseId, string userId, bool isAdmin);
    Task<ClassroomLessonDto> CreateLessonAsync(CreateLessonDto dto);
    Task ReorderLessonsAsync(ReorderLessonsDto dto);
    Task BulkSaveContentsAsync(SaveLessonContentsDto dto);
    Task<bool> DeleteLessonAsync(Guid id);
    Task<ClassroomLessonDto> UpdateLessonAsync(UpdateLessonDto dto);
}