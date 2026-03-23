using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Course;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;
using LMS.Backend.Common;

namespace LMS.Backend.Services.Implement;

public class CourseService : ICourseService
{
    private readonly ICourseRepository _courseRepo;
    private readonly IClassworkRepository _classworkRepo;
    private readonly IMapper _mapper;
    private readonly IFileService _fileService;

    public CourseService(
        ICourseRepository courseRepo,
        IClassworkRepository classworkRepo,
        IMapper mapper,
        IFileService fileService
    )
    {
        _courseRepo = courseRepo;
        _classworkRepo = classworkRepo;
        _mapper = mapper;
        _fileService = fileService;
    }

    public async Task<CourseDetailDto?> GetCourseByIdAsync(Guid id)
    {
        var course = await _courseRepo.GetFullClassroomDetailsAsync(id);
        if (course == null) return null;

        return _mapper.Map<CourseDetailDto>(course);
    }

    public async Task<Course> CreateCourseAsync(CreateCourseDto dto, string creatorId)
    {
        // 1. Map basic fields
        var course = _mapper.Map<Course>(dto);

        // 2. Parse Enums & Badge
        course.Status = Enum.TryParse<CourseStatus>(dto.Status, true, out var status)
                        ? status : CourseStatus.Draft;

        course.Badge = string.IsNullOrWhiteSpace(dto.Badge)
                       ? "GENERAL"
                       : dto.Badge.Trim().ToUpper();

        // 3. File Upload using LocalFileService
        if (dto.ThumbnailFile != null && dto.ThumbnailFile.Length > 0)
        {
            course.Thumbnail = await _fileService.UploadFileAsync(dto.ThumbnailFile, "thumbnails");
        }
        else
        {
            course.Thumbnail = "/uploads/No_Thumbnial.svg";
        }

        // 4. Add Course to Repo
        await _courseRepo.AddAsync(course);
        await _courseRepo.SaveChangesAsync();

        // 5. Create Default Topic (Using new ClassworkTopic entity)
        var defaultTopic = new ClassworkTopic
        {
            Id = Guid.NewGuid(),
            Title = "General Announcements & Introduction",
            CourseId = course.Id,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = creatorId,
            Items = new() // Keep compiler happy (no null warnings)
        };

        // Use the new repository method we just built
        await _classworkRepo.CreateTopicAsync(defaultTopic);

        return course;
    }

    public async Task<IEnumerable<Course>> GetAllCoursesAsync()
    {
        // Use the specialized repo method we just created
        return await _courseRepo.GetAllWithTopicsAsync();
    }
}