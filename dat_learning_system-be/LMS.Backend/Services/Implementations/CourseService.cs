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

    public async Task<IEnumerable<CourseDetailDto>> GetAllCoursesAsync(bool isAdmin)
    {
        var courses = await _courseRepo.GetAllWithTopicsAsync(showDrafts: isAdmin);
        return _mapper.Map<IEnumerable<CourseDetailDto>>(courses);
    }

    public async Task<CourseSummaryDto> CreateCourseAsync(CreateCourseDto dto, string creatorId)
    {
        // 1. Map basic fields from DTO to Entity
        var course = _mapper.Map<Course>(dto);

        // 2. Parse Enums & Format Badge
        course.Status = Enum.TryParse<CourseStatus>(dto.Status, true, out var status)
                        ? status : CourseStatus.Draft;

        course.Badge = string.IsNullOrWhiteSpace(dto.Badge)
                       ? "GENERAL"
                       : dto.Badge.Trim().ToUpper();

        // 3. Handle Thumbnail Upload
        if (dto.ThumbnailFile != null && dto.ThumbnailFile.Length > 0)
        {
            course.Thumbnail = await _fileService.UploadFileAsync(dto.ThumbnailFile, "thumbnails");
        }
        else
        {
            course.Thumbnail = "/uploads/No_Thumbnial.svg";
        }

        // 4. Save Course to generate the ID
        await _courseRepo.AddAsync(course);
        await _courseRepo.SaveChangesAsync();

        // 5. Create Default Topic for the new course
        var defaultTopic = new ClassworkTopic
        {
            Id = Guid.NewGuid(),
            Title = "General Announcements & Introduction",
            CourseId = course.Id,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = creatorId,
            Items = new() 
        };

        await _classworkRepo.CreateTopicAsync(defaultTopic);

        // 6. Return the finished product as a DTO
        return _mapper.Map<CourseSummaryDto>(course);
    }

    public async Task<CourseSummaryDto> UpdateCourseAsync(Guid id, UpdateCourseDto dto)
    {
        var existing = await _courseRepo.GetByIdWithIgnoreFilterAsync(id);
        if (existing == null) throw new Exception("Course not found");

        // 1. Manual Sync using AutoMapper 
        // Ensure Status and Badge are Ignored in MappingProfile to prevent null overwrites
        _mapper.Map(dto, existing);

        // 2. Handle Badge formatting
        if (dto.Badge != null)
        {
            existing.Badge = string.IsNullOrWhiteSpace(dto.Badge)
                             ? "GENERAL"
                             : dto.Badge.Trim().ToUpper();
        }

        // 3. Handle Enum updates
        if (!string.IsNullOrEmpty(dto.Status))
        {
            existing.Status = Enum.TryParse<CourseStatus>(dto.Status, true, out var status)
                              ? status : existing.Status;
        }

        // 4. Handle Thumbnail Update
        if (dto.ThumbnailFile != null)
        {
            // Note: You could call _fileService.DeleteFile(existing.Thumbnail) here if needed
            existing.Thumbnail = await _fileService.UploadFileAsync(dto.ThumbnailFile, "thumbnails");
        }

        _courseRepo.Update(existing);
        await _courseRepo.SaveChangesAsync();

        // 5. Return the updated DTO
        return _mapper.Map<CourseSummaryDto>(existing);
    }

    public async Task SoftDeleteCourseAsync(Guid id)
    {
        var course = await _courseRepo.GetByIdAsync(id);
        if (course == null) return;

        course.Status = CourseStatus.Closed;
        _courseRepo.Update(course);
        await _courseRepo.SaveChangesAsync();
    }

    public async Task HardDeleteCourseAsync(Guid id)
    {
        var course = await _courseRepo.GetByIdWithIgnoreFilterAsync(id);
        if (course == null) return;

        _courseRepo.Delete(course);
        await _courseRepo.SaveChangesAsync();
    }
}