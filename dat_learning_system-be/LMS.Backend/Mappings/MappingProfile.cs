using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Auth;
using LMS.Backend.DTOs.Course;
using LMS.Backend.DTOs.OrgUnit;
using LMS.Backend.DTOs.User;
using LMS.Backend.DTOs.Classroom;
using LMS.Backend.DTOs.Lesson;


namespace LMS.Backend.Helpers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Existing User mapping
        CreateMap<ApplicationUser, UserResponseDto>()
            // Map the Enum to String automatically
            .ForMember(dest => dest.Position, opt => opt.MapFrom(src => src.Position.ToString()))
            // Map the Navigation Property Name
            .ForMember(dest => dest.OrgUnitName, opt => opt.MapFrom(src => src.OrgUnit != null ? src.OrgUnit.Name : null));

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
    }
}