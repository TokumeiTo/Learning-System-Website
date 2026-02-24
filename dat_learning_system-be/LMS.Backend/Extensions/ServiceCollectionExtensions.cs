using LMS.Backend.Data.Repositories;
using LMS.Backend.Data.Repositories.Interfaces;
using LMS.Backend.Helpers;
using LMS.Backend.Repo.Implement;
using LMS.Backend.Repo.Interface;
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
        services.AddScoped<ITopicRepository, TopicRepository>();
        services.AddScoped<IAssignmentRepository, AssignmentRepository>();
        services.AddScoped<ISubmissionRepository, SubmissionRepository>();
        services.AddScoped<ILessonRepository, LessonRepository>();
        services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();
        services.AddScoped<IAuditRepository, AuditRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<IUserProgressRepository, UserProgressRepository>();
        services.AddScoped<ITestRepository, TestRepository>();

        // Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IOrgUnitService, OrgUnitService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICourseService, CourseService>();
        services.AddScoped<ICourseRatingService, CourseRatingService>();
        services.AddScoped<ILessonService, LessonService>();
        services.AddScoped<IEnrollmentService, EnrollmentService>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<ITranslationService, TranslationService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IUserProgressService, UserProgressService>();
        services.AddScoped<ITestService, TestService>();

        // Helpers
        services.AddSingleton<JwtHelper>();

        return services;
    }
}