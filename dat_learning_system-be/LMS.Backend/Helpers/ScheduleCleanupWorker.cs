using LMS.Backend.Data.Dbcontext;

namespace LMS.Backend.Services.Background;

public class ScheduleCleanupWorker(IServiceScopeFactory scopeFactory) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                
                // Remove schedules that started more than 14 days ago
                var expiryDate = DateTime.UtcNow.AddDays(-14);
                var oldRecords = context.SchedulePlans.Where(s => s.StartTime < expiryDate);

                if (oldRecords.Any())
                {
                    context.SchedulePlans.RemoveRange(oldRecords);
                    await context.SaveChangesAsync();
                }
            }
            // Run every 24 hours
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }
}