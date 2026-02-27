using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class LessonAttemptConfiguration : IEntityTypeConfiguration<LessonAttempt>
{
    public void Configure(EntityTypeBuilder<LessonAttempt> builder)
    {
        builder.HasKey(la => la.Id);
        builder.Property(la => la.UserId).IsRequired();

        // Good precision for percentages (e.g., 99.99)
        builder.Property(la => la.Percentage).HasColumnType("decimal(5,2)");

        // --- NEW RELATIONSHIPS ---

        // Link to the specific Test (Crucial for the "Retry" logic)
        builder.HasOne(la => la.Test)
               .WithMany() // One test can have many attempts
               .HasForeignKey(la => la.TestId)
               .OnDelete(DeleteBehavior.Restrict); // Keep attempts for history even if test is deleted

        /*
            Scenario A (Admin/Audit): "Show me the history of all attempts." -> Use AttemptedAt.
            Scenario B (Student/KPI): "Did I pass this lesson yet?" -> Use Percentage or IsPassed.
        */
        builder.HasIndex(la => new { la.UserId, la.LessonId, la.AttemptedAt, la.Percentage })
            .HasDatabaseName("IX_User_Lesson_Performance");
    
        builder.HasOne(la => la.Test)
               .WithMany()
               .HasForeignKey(la => la.TestId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(la => la.Lesson.Course.Status != CourseStatus.Closed);
    }
}