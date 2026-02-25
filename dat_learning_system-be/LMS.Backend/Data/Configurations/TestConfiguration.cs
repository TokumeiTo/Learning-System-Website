using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class TestConfiguration : IEntityTypeConfiguration<Test>
{
    public void Configure(EntityTypeBuilder<Test> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Title).HasMaxLength(200).IsRequired();
        builder.Property(t => t.PassingGrade).HasDefaultValue(40);

        // --- THE MISSING PIECE ---
        // Explicitly link back to LessonContent. 
        // This ensures the Guid TestId matches the LessonContentId logic.
        builder.HasOne(t => t.LessonContent)
               .WithOne(lc => lc.Test)
               .HasForeignKey<Test>(t => t.LessonContentId)
               .OnDelete(DeleteBehavior.Cascade);

        // Test -> Questions (One-to-Many)
        builder.HasMany(t => t.Questions)
               .WithOne(q => q.Test)
               .HasForeignKey(q => q.TestId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(t => t.LessonContent.Lesson.Course.Status != CourseStatus.Closed);
    }
}