using LMS.Backend.DTOs.Classroom;

namespace LMS.Backend.Services.Interfaces;
public interface ILessonService
{
    Task<ClassroomViewDto?> GetClassroomViewAsync(Guid courseId);
}