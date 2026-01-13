using LMS.Backend.Helpers;

namespace LMS.Backend.Extenions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddSingleton<JwtHelper>();
        services.AddSingleton<PasswordHasher>();

        return services;
    }
}