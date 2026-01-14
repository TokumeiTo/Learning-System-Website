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

        // Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IOrgUnitService, OrgUnitService>();
        services.AddScoped<IUserService, UserService>();

        // Helpers
        services.AddSingleton<JwtHelper>();

        return services;
    }
}