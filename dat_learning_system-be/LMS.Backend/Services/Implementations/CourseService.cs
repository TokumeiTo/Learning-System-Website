using AutoMapper;
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
    private readonly IMapper _mapper;
    private readonly IWebHostEnvironment _environment;

    public CourseService(
        ICourseRepository courseRepo,
        ITopicRepository topicRepo,
        IMapper mapper,
        IWebHostEnvironment environment
    )
    {
        _courseRepo = courseRepo;
        _topicRepo = topicRepo;
        _mapper = mapper;
        _environment = environment;
    }

    public async Task<CourseDetailDto?> GetCourseByIdAsync(Guid id)
    {
        // Use your repo method with .Include() logic
        var course = await _courseRepo.GetFullClassroomDetailsAsync(id);

        if (course == null) return null;

        return _mapper.Map<CourseDetailDto>(course);
    }
    public async Task<Course> CreateCourseAsync(CreateCourseDto dto, string creatorId)
    {
        // 1. Map basic fields
        var course = _mapper.Map<Course>(dto);

        // 2. Parse Enums (Crucial: if these fail, the record won't save correctly)
        course.Status = Enum.TryParse<CourseStatus>(dto.Status, true, out var status)
                        ? status : CourseStatus.Draft;

        // Replace the old Badge parsing logic with this:
        course.Badge = string.IsNullOrWhiteSpace(dto.Badge)
               ? "GENERAL"
               : dto.Badge.Trim().ToUpper();

        // 3. File Upload Logic
        if (dto.ThumbnailFile != null && dto.ThumbnailFile.Length > 0)
        {
            string baseRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            string uploadsFolder = Path.Combine(baseRoot, "uploads");

            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.ThumbnailFile.FileName);
            string fullFilePath = Path.Combine(uploadsFolder, fileName);

            using (var fileStream = new FileStream(fullFilePath, FileMode.Create))
            {
                await dto.ThumbnailFile.CopyToAsync(fileStream);
            }

            course.Thumbnail = $"/uploads/{fileName}";
        }
        else
        {
            course.Thumbnail = "/uploads/No_Thumbnial.svg";
        }

        // 4. Add Course to Repo
        await _courseRepo.AddAsync(course);

        // IMPORTANT: Save changes here first to generate the Course ID in the DB
        await _courseRepo.SaveChangesAsync();

        // 5. Create Default Topic
        var defaultTopic = new Topic
        {
            Id = Guid.NewGuid(),
            Title = "General Announcements & Introduction",
            CourseId = course.Id // Now we are sure this ID exists in the DB
        };

        await _topicRepo.AddAsync(defaultTopic);

        // 6. Final Save for the Topic
        await _courseRepo.SaveChangesAsync();

        return course;
    }

    public async Task<IEnumerable<Course>> GetAllCoursesAsync()
        => await _courseRepo.GetAllAsync();
}