using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Course;

namespace LMS.Backend.Services.Interfaces;

public interface ICourseService
{
    Task<CourseSummaryDto> CreateCourseAsync(CreateCourseDto dto, string creatorId);
    Task<CourseSummaryDto> UpdateCourseAsync(Guid id, UpdateCourseDto dto);
    Task<IEnumerable<CourseDetailDto>> GetAllCoursesAsync(bool isAdmin);
    Task<CourseDetailDto?> GetCourseByIdAsync(Guid id);
    Task SoftDeleteCourseAsync(Guid id);
    Task HardDeleteCourseAsync(Guid id);
}