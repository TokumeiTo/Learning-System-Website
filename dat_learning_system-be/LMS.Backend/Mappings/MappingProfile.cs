using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Auth;
using LMS.Backend.DTOs.Course;
using LMS.Backend.DTOs.OrgUnit;
using LMS.Backend.DTOs.User;
using LMS.Backend.DTOs.Classroom;
using LMS.Backend.DTOs.Lesson;
using LMS.Backend.DTOs.Enrollment;
using LMS.Backend.DTOs.Audit;
using LMS.Backend.DTOs.Test_Quest;
using LMS.Backend.DTOs.Announce_Noti;
using LMS.Backend.Common;
using LMS.Backend.DTOs.Flashcard;
using LMS.Backend.Data;
using LMS.Backend.DTOs.Classwork;
using LMS.Backend.DTOs.Library;
using LMS.Backend.DTOs.RoadMap;

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

        // --- COURSE MAPPING ---
        CreateMap<CreateCourseDto, Course>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.Badge, opt => opt.Ignore())
            .ForMember(dest => dest.Thumbnail, opt => opt.Ignore());

        CreateMap<UpdateCourseDto, Course>()
            .ForMember(dest => dest.Thumbnail, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.Badge, opt => opt.Ignore());

        // ADD THIS: The Lightweight Response Map
        CreateMap<Course, CourseSummaryDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.Badge, opt => opt.MapFrom(src => src.Badge ?? "GENERAL"));

        // Full Details (keep for the View Page)
        CreateMap<Course, CourseDetailDto>()
            .ForMember(dest => dest.Badge, opt => opt.MapFrom(src => src.Badge ?? "GENERAL"))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));


        // --- LESSON MAPPING ---
        // Consolidate into one mapping for creation
        CreateMap<CreateLessonDto, Lesson>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
            .ForMember(dest => dest.Contents, opt => opt.MapFrom(_ => new List<LessonContent>()));

        CreateMap<Lesson, LessonDto>();

        // Update mapping: ensure we don't overwrite structural data
        CreateMap<UpdateLessonDto, Lesson>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CourseId, opt => opt.Ignore())
            .ForMember(dest => dest.SortOrder, opt => opt.Ignore())
            .ForMember(dest => dest.Contents, opt => opt.Ignore());

        // --- CLASSROOM/LESSONCONTENT PROFILE MAPPING ---
        CreateMap<LessonContent, ClassroomContentDto>()
            .ForMember(dest => dest.Test, opt => opt.MapFrom(src => src.Tests.FirstOrDefault(t => t.IsActive)));

        CreateMap<Lesson, ClassroomLessonDto>()
            // We explicitly ignore these because they no longer exist in the Lesson entity.
            // They are destination-only properties that the Service will calculate.
            .ForMember(dest => dest.IsDone, opt => opt.Ignore())
            .ForMember(dest => dest.IsLocked, opt => opt.Ignore());


        CreateMap<LessonContentUploadDto, LessonContent>()
            .ForMember(dest => dest.Tests, opt => opt.Ignore())
            .ForMember(dest => dest.Lesson, opt => opt.Ignore());

        CreateMap<Course, ClassroomViewDto>()
            .ForMember(dest => dest.CourseId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.CourseTitle, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.Lessons, opt => opt.MapFrom(src => src.Lessons));

        // --- CLASSWORK MAPPING ---
        CreateMap<ClassworkTopic, ClassworkTopicDto>();

        CreateMap<ClassworkItem, ClassworkItemDto>()
            .ForMember(dest => dest.MySubmission, opt => opt.MapFrom((src, dest, destMember, context) =>
            {
                // Look for the current user's ID in the mapping context
                if (context.Items.TryGetValue("CurrentUserId", out var userIdObj) && userIdObj is string currentUserId)
                {
                    var submission = src.Submissions.FirstOrDefault(s => s.UserId == currentUserId);
                    return context.Mapper.Map<ClassworkSubmissionDto>(submission);
                }
                return null;
            }));

        CreateMap<ClassworkResource, ClassworkResourceDto>();

        CreateMap<ClassworkSubmission, ClassworkSubmissionDto>()
            .ForMember(dest => dest.Feedback, opt => opt.MapFrom(src => src.Feedback ?? string.Empty));

        CreateMap<ClassworkSubmission, AdminSubmissionViewDto>()
            .ForMember(dest => dest.StudentId, opt => opt.MapFrom(src => src.UserId))
            // StudentName will be populated manually in the service to avoid complex DB joins in the profile
            .ForMember(dest => dest.StudentName, opt => opt.Ignore());

        CreateMap<CreateClassworkItemDto, ClassworkItem>()
            .ForMember(dest => dest.Resources, opt => opt.Ignore());

        // --- PROGRESS MAPPING ---
        CreateMap<UserLessonProgress, LessonProgressDto>();
        CreateMap<UpsertLessonContentDto, LessonContent>()
            .ForMember(dest => dest.Tests, opt => opt.Ignore())
            // If Body is null (which it will be for a Test), ensure we don't crash
            .ForMember(dest => dest.Body, opt => opt.NullSubstitute(string.Empty));

        // --- ENROLLMENT MAPPING ---
        CreateMap<Enrollment, EnrollmentRequestDto>()
            .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.User.FullName))
            .ForMember(dest => dest.StudentEmail, opt => opt.MapFrom(src => src.User.Email))
            .ForMember(dest => dest.CourseTitle, opt => opt.MapFrom(src => src.Course.Title));

        // --- AUDIT MAPPING ---
        CreateMap<AuditLog, GlobalAuditLogDto>()
            .ForMember(dest => dest.PerformedBy, opt => opt.MapFrom(src => src.AdminUser != null
                ? $"{src.AdminUser.Email}"
                : src.PerformedBy));

        // --- TESTS AND QUESTIONS ---
        // Entity -> DTO (For Reading)
        CreateMap<Test, TestDto>()
            .ForMember(dest => dest.IsGlobal, opt => opt.MapFrom(src => src.LessonContent == null))
            .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions.OrderBy(q=>q.SortOrder)));

        CreateMap<Question, QuestionDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));

        CreateMap<LessonAttempt, QuizResultDto>()
            .ForMember(dest => dest.Percentage, opt => opt.MapFrom(src => (double)src.Percentage));

        CreateMap<LessonAttempt, LessonAttemptDto>();

        // DTO -> Entity (For Admin Saving/Upserting)
        CreateMap<TestDto, Test>()
            .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions))
            .ForMember(dest => dest.PassingGrade, opt => opt.MapFrom(src => src.PassingGrade == 0 ? 40 : src.PassingGrade));
        CreateMap<QuestionDto, Question>()
            .ForMember(dest => dest.Options, opt => opt.MapFrom(src => src.Options))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => Enum.Parse<QuizType>(src.Type)));
        CreateMap<OptionDto, QuestionOption>();


        // This ensures IsCorrect is hidden if the Student is the one requesting the data
        // Entity -> DTO (Student Viewing)
        CreateMap<QuestionOption, OptionDto>()
            .ForMember(dest => dest.IsCorrect, opt => opt.MapFrom((src, dest, destMember, context) =>
            {
                // 1. Check if the context allows items at all without triggering the exception
                // TryGetItems is the officially recommended way to handle this safely.
                if (context.TryGetItems(out var items) && items.TryGetValue("IsAdmin", out var isAdmin))
                {
                    if (isAdmin is bool adminBool && adminBool)
                    {
                        return src.IsCorrect;
                    }
                }

                // 2. Default to null (Student view) if anything is missing or fails
                return (bool?)null;
            }));
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        // --- ANNOUNCEMENTS ---
        CreateMap<UpsertAnnouncementDto, Announcement>()
            .ForMember(dest => dest.TargetPosition, opt => opt.MapFrom(src =>
                (src.TargetPositions == null || !src.TargetPositions.Any())
                    ? null
                    : string.Join(",", src.TargetPositions))) // Joins ["Admin", "DivHead"] into "Admin,DivHead"
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

        CreateMap<Announcement, AnnouncementResponseDto>()
            .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.CreatedByUser.FullName));

        // --- NOTIFICATIONS ---
        CreateMap<Notification, NotificationResponseDto>();

        // --- KANJIFlashcard MAPPINGS ---

        // Entity -> DTO (Read)
        CreateMap<Kanji, KanjiDto>()
            .ForMember(dest => dest.Onyomi, opt => opt.MapFrom(src =>
                !string.IsNullOrEmpty(src.Onyomi) ? src.Onyomi.Split(';', StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>()))
            .ForMember(dest => dest.Kunyomi, opt => opt.MapFrom(src =>
                !string.IsNullOrEmpty(src.Kunyomi) ? src.Kunyomi.Split(';', StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>()));

        CreateMap<KanjiExample, KanjiExampleDto>();

        // DTO -> Entity (Create)
        CreateMap<KanjiCreateUpdateDto, Kanji>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
            .ForMember(dest => dest.Onyomi, opt => opt.MapFrom(src => string.Join(";", src.Onyomi)))
            .ForMember(dest => dest.Kunyomi, opt => opt.MapFrom(src => string.Join(";", src.Kunyomi)))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
            // We ignore Examples because we will handle children manually for safety
            .ForMember(dest => dest.Examples, opt => opt.Ignore());

        CreateMap<KanjiExampleDto, KanjiExample>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id == Guid.Empty ? Guid.NewGuid() : src.Id));


        // --- GRAMMAR FLESHCARD MAPPING ---

        // 1. Grammar Mapping (Create/Update -> Entity)
        CreateMap<GrammarCreateUpdateDto, Grammar>()
            // Generate a new ID for new records
            .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
            // 🛡️ VERY IMPORTANT: We ignore Examples here so the Service's 
            // manual sync logic can handle the child collection safely.
            .ForMember(dest => dest.Examples, opt => opt.Ignore());

        // 2. Grammar Example Mapping
        CreateMap<GrammarExampleDto, GrammarExample>()
            // If the ID is null or empty (new row in React), generate a Guid.
            // If it exists, keep it so EF knows it's an update, not an insert.
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src =>
                (src.Id == null || src.Id == Guid.Empty) ? Guid.NewGuid() : src.Id));

        // 3. Entity -> DTO Mapping (For sending data back to React)
        CreateMap<Grammar, GrammarDto>();
        CreateMap<GrammarExample, GrammarExampleDto>();

        // --- VOCABULARY MAPPING ---
        CreateMap<Vocabulary, VocabResponseDto>();
        CreateMap<VocabularyExample, VocabExampleDto>();

        // Request DTO -> Entity
        // We ignore Id during Create/Update to handle it manually in our sync logic
        CreateMap<VocabUpsertRequestDto, Vocabulary>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Examples, opt => opt.MapFrom(src => src.Examples));

        CreateMap<VocabExampleDto, VocabularyExample>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        // --- ONOMATOPOEIA ---
        // Entity -> Response (For GET requests)
        CreateMap<Onomatopoeia, OnomatoResponseDto>();
        CreateMap<OnomatopoeiaExample, OnomatoExampleDto>();

        // Request -> Entity (For POST/PUT requests)
        CreateMap<OnomatoUpsertRequestDto, Onomatopoeia>()
            .ForMember(dest => dest.Examples, opt => opt.MapFrom(src => src.Examples));

        CreateMap<OnomatoExampleDto, OnomatopoeiaExample>();


        // --- LIBRARY / EBOOK MAPPING ---

        // Entity -> Response (For GET)
        CreateMap<EBook, EBookResponseDto>();

        // Request -> Entity (For Create/Update)
        CreateMap<EBookRequestDto, EBook>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.TotalDownloadCount, opt => opt.Ignore())
            .ForMember(dest => dest.TotalReaderCount, opt => opt.Ignore())
            .ForMember(dest => dest.AverageRating, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

        CreateMap<UserBookProgress, UserBookProgressDto>().ReverseMap();


        // --- ROADMAP MAPPING ---
        CreateMap<RoadMap, RoadmapResponseDto>()
            .ForMember(dest => dest.StepCount, opt => opt.MapFrom(src => src.Steps.Count));

        CreateMap<RoadmapStep, RoadmapStepDto>();
        CreateMap<RoadmapRequestDto, RoadMap>();
    }
}