using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Auth;
using LMS.Backend.DTOs.Course;
using LMS.Backend.DTOs.OrgUnit;
using LMS.Backend.DTOs.User;
using LMS.Backend.DTOs.Classroom;
using LMS.Backend.DTOs.Lesson;
using LMS.Backend.DTOs.Enrollment;
using LMS.Backend.DTOs.Topic;
using LMS.Backend.DTOs.Audit;
using LMS.Backend.Common;


namespace LMS.Backend.Helpers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<ApplicationUser, UserResponseDto>()
            // Map Entity.Position (Enum) -> DTO.PositionName (String)
            .ForMember(dest => dest.PositionName, opt => opt.MapFrom(src => src.Position.ToString()))
            // Map Entity.Position (Enum) -> DTO.Position (Integer)
            .ForMember(dest => dest.Position, opt => opt.MapFrom(src => (int)src.Position))
            // Explicitly map CompanyCode
            .ForMember(dest => dest.CompanyCode, opt => opt.MapFrom(src => src.CompanyCode))
            // Handle OrgUnit with null-safety
            .ForMember(dest => dest.OrgUnitName, opt => opt.MapFrom(src =>
                src.OrgUnit != null ? src.OrgUnit.Name : "N/A"))
            .ForMember(dest => dest.OrgUnitId, opt => opt.MapFrom(src => src.OrgUnitId));
            
        // Mapping Request DTO -> Entity (Used in UpdateUserAsync)
        CreateMap<UserUpdateRequestDto, ApplicationUser>()
            .ForMember(dest => dest.Position, opt => opt.Ignore()) // Handled manually in service
            .ForMember(dest => dest.OrgUnitId, opt => opt.MapFrom(src => src.OrgUnitId));

        // Registration mapping
        CreateMap<RegisterRequestDto, ApplicationUser>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.CompanyCode))
            .ForMember(dest => dest.MustChangePassword, opt => opt.MapFrom(_ => true));

        // Login response mapping
        CreateMap<ApplicationUser, LoginResponseDto>()
            .ForMember(dest => dest.Position, opt => opt.MapFrom(src => src.Position.ToString()));

        // Orgunit request mapping
        CreateMap<OrgUnitRequestDto, OrgUnit>();
        // Orgunit response mapping
        CreateMap<OrgUnit, OrgUnitResponseDto>();
        CreateMap<OrgUnit, OrgUnitSelectDto>();

        // Course mapping
        CreateMap<CreateCourseDto, Course>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
            // Ignore these as they require Enum parsing or manual logic
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.Badge, opt => opt.Ignore())
            .ForMember(dest => dest.Thumbnail, opt => opt.Ignore());
        CreateMap<Course, CourseDetailDto>()
        .ForMember(dest => dest.Badge, opt => opt.MapFrom(src => src.Badge.ToString()))
        .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<Topic, TopicDto>();
        CreateMap<Lesson, LessonDto>();

        // Classroom Profile
        CreateMap<LessonContent, ClassroomContentDto>();
        CreateMap<Lesson, ClassroomLessonDto>();
        CreateMap<Course, ClassroomViewDto>()
            .ForMember(dest => dest.CourseId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.CourseTitle, opt => opt.MapFrom(src => src.Title));

        // Lesson
        CreateMap<CreateLessonDto, Lesson>();
        CreateMap<CreateLessonDto, Lesson>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
            .ForMember(dest => dest.Contents, opt => opt.MapFrom(_ => new List<LessonContent>()))
            .ForMember(dest => dest.IsLocked, opt => opt.MapFrom(_ => false))
            .ForMember(dest => dest.IsDone, opt => opt.MapFrom(_ => false));
        CreateMap<UpsertLessonContentDto, LessonContent>();
        CreateMap<UpdateLessonDto, Lesson>()
            .ForMember(dest => dest.CourseId, opt => opt.Ignore())
            .ForMember(dest => dest.SortOrder, opt => opt.Ignore())
            .ForMember(dest => dest.Contents, opt => opt.Ignore());

        // Enrollments
        CreateMap<Enrollment, EnrollmentRequestDto>()
            .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.User.FullName))
            .ForMember(dest => dest.StudentEmail, opt => opt.MapFrom(src => src.User.Email))
            .ForMember(dest => dest.CourseTitle, opt => opt.MapFrom(src => src.Course.Title));

        // Audit
        CreateMap<AuditLog, GlobalAuditLogDto>()
            .ForMember(dest => dest.PerformedBy, opt => opt.MapFrom(src => src.AdminUser != null
                    ? $"{src.AdminUser.Email}"
                    : src.PerformedBy));
    }
}