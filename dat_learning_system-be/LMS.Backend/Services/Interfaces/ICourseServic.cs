using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Course;

namespace LMS.Backend.Services.Interfaces;

public interface ICourseService
{
    Task<Course> CreateCourseAsync(CreateCourseDto dto, string creatorId);
    Task<IEnumerable<Course>> GetAllCoursesAsync();
}