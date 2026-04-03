using LMS.Backend.DTOs.Lesson;
using LMS.Backend.DTOs.Classwork;

namespace LMS.Backend.DTOs.Course;
public class CourseDetailDto
{
    public Guid Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool IsMandatory { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Thumbnail { get; set; } = string.Empty;
    public double TotalHours { get; set; }
    public double Rating { get; set; }
    public string? Badge { get; set; } = string.Empty;
    public int EnrolledCount { get; set; }
    public string Status { get; set; } = string.Empty;

    // Collections for the Modal Syllabus
    public List<ClassworkTopicDto> ClassworkTopics { get; set; } = new();
    public List<LessonDto> Lessons { get; set; } = new();
}