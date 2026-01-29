using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Course;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;
public class CourseService : ICourseService
{
    private readonly ICourseRepository _courseRepo;
    private readonly ITopicRepository _topicRepo;

    public CourseService(ICourseRepository courseRepo, ITopicRepository topicRepo)
    {
        _courseRepo = courseRepo;
        _topicRepo = topicRepo;
    }

    public async Task<Course> CreateCourseAsync(CreateCourseDto dto, string creatorId)
    {
        string thumbnailUrl = $"https://picsum.photos/seed/{Guid.NewGuid()}/400/250";
        var course = new Course
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Category = dto.Category,
            Description = dto.Description,
            TotalHours = dto.TotalHours,
            IsMandatory = dto.IsMandatory,
            Status = Enum.Parse<CourseStatus>(dto.Status),
            Badge = Enum.Parse<CourseBadge>(dto.Badge),
            Thumbnail = thumbnailUrl // Placeholder like your React code
        };

        await _courseRepo.AddAsync(course);

        // Auto-create the first Topic (Google Classroom behavior)
        var defaultTopic = new Topic
        {
            Id = Guid.NewGuid(),
            Title = "General Announcements & Introduction",
            CourseId = course.Id
        };
        await _topicRepo.AddAsync(defaultTopic);

        await _courseRepo.SaveChangesAsync();
        return course;
    }

    public async Task<IEnumerable<Course>> GetAllCoursesAsync() 
        => await _courseRepo.GetAllAsync();
}