using LMS.Backend.Data.Dbcontext;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Services.Background;

public class AnnouncementCleanupWorker(IServiceScopeFactory scopeFactory, ILogger<AnnouncementCleanupWorker> logger) 
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try 
            {
                using var scope = scopeFactory.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var expired = await context.Announcements
                    .Where(a => a.DisplayUntil < DateTime.UtcNow)
                    .ToListAsync(stoppingToken);

                if (expired.Any())
                {
                    context.Announcements.RemoveRange(expired);
                    await context.SaveChangesAsync(stoppingToken);
                    logger.LogInformation($"Cleaned up {expired.Count} expired announcements.");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred during announcement cleanup.");
            }

            // Run once every hour
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }
}