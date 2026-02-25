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
               .OnDelete(DeleteBehavior.NoAction); // Keep attempts for history even if test is deleted

        // Link to Lesson (for high-level progress tracking)
        builder.HasOne(la => la.Lesson)
               .WithMany(l => l.Attempts)
               .HasForeignKey(la => la.LessonId)
               .OnDelete(DeleteBehavior.Cascade);

        // --- UPDATED INDEXING ---
        // We need to quickly find a student's best attempt for a SPECIFIC test
        builder.HasIndex(la => new { la.UserId, la.TestId, la.AttemptedAt });

        builder.HasQueryFilter(la => la.Lesson.Course.Status != CourseStatus.Closed);
    }
}