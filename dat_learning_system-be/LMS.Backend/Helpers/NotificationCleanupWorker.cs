using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Background;

public class NotificationCleanupWorker(
    IServiceProvider serviceProvider, 
    ILogger<NotificationCleanupWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            // Logic: Only run the full cleanup on the 1st of every month
            var now = DateTime.UtcNow;
            
            using (var scope = serviceProvider.CreateScope())
            {
                var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
                var userRepo = scope.ServiceProvider.GetRequiredService<IUserRepository>();

                try 
                {
                    // 1. Get the list of Admin/SuperAdmin IDs
                    var adminIds = await userRepo.GetAdminUserIdsAsync();

                    // 2. Scenario: 3 Days before the end of the month (Warning)
                    if (now.Day == DateTime.DaysInMonth(now.Year, now.Month) - 3)
                    {
                        foreach (var id in adminIds)
                        {
                            await notificationService.SendSystemNotificationAsync(id, 
                                "System Maintenance", 
                                "Reminder: Automatic cleanup of notifications older than 30 days will occur in 3 days.",
                                null, "System");
                        }
                    }

                    // 3. Scenario: It is the 1st of the month (Cleanup Day)
                    if (now.Day == 1)
                    {
                        await notificationService.RunCleanupJobAsync();

                        foreach (var id in adminIds)
                        {
                            await notificationService.SendSystemNotificationAsync(id, 
                                "Cleanup Complete", 
                                $"Monthly notification maintenance was successful. Old records have been cleared.",
                                null, "System");
                        }
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Notification Cleanup Worker encountered an error.");
                    // Optional: Notify SuperAdmins specifically if the job fails
                }
            }

            // Sleep for 24 hours (Check again tomorrow)
            await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
        }
    }
}