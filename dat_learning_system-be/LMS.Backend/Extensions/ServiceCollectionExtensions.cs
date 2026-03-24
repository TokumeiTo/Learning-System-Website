using LMS.Backend.Helpers;
using LMS.Backend.Repo.Implement;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services;
using LMS.Backend.Services.Implement;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Repos
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IOrgUnitRepository, OrgUnitRepository>();
        services.AddScoped<ICourseRepository, CourseRepository>();
        services.AddScoped<ICourseRatingRepository, CourseRatingRepository>();
        services.AddScoped<IClassworkRepository, ClassworkRepository>();
        services.AddScoped<ILessonRepository, LessonRepository>();
        services.AddScoped<ILessonAttemptRepository, LessonAttemptRepository>();
        services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();
        services.AddScoped<IAuditRepository, AuditRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<IUserProgressRepository, UserProgressRepository>();
        services.AddScoped<ITestRepository, TestRepository>();
        services.AddScoped<IKanjiFlashcardRepository, KanjiFlashcardRepository>();
        services.AddScoped<IGrammarFlashcardRepository, GrammarFlashcardRepository>();
        services.AddScoped<IVocabularyRepository, VocabularyRepository>();
        services.AddScoped<IOnomatoRepository, OnomatoRepository>();
        services.AddScoped<ILibraryRepository, LibraryRepository>();
        services.AddScoped<IRoadmapRepository, RoadmapRepository>();

        // Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IFileService, LocalFileService>();
        services.AddScoped<IOrgUnitService, OrgUnitService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICourseService, CourseService>();
        services.AddScoped<ICourseRatingService, CourseRatingService>();
        services.AddScoped<IClassworkService, ClassworkService>();
        services.AddScoped<IMediaHandlerService, MediaHandlerService>();
        services.AddScoped<ILessonService, LessonService>();
        services.AddScoped<IEnrollmentService, EnrollmentService>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<ITranslationService, TranslationService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IUserProgressService, UserProgressService>();
        services.AddScoped<ITestService, TestService>();
        services.AddScoped<IKanjiFlashcardService, KanjiFlashcardService>();
        services.AddScoped<IGrammarFlashcardService, GrammarFlashcardService>();
        services.AddScoped<IVocabularyService, VocabularyService>();
        services.AddScoped<IOnomatoService, OnomatoService>();
        services.AddScoped<ILibraryService, LibraryService>();
        services.AddScoped<IRoadmapService, RoadmapService>();

        // Helpers
        services.AddSingleton<JwtHelper>();

        return services;
    }
}