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

        builder.HasOne(t => t.LessonContent)
               .WithMany(lc => lc.Tests)
               .HasForeignKey(t => t.LessonContentId)
               .IsRequired(false)
               .OnDelete(DeleteBehavior.Cascade);

        // Test -> Questions (One-to-Many)
        builder.HasMany(t => t.Questions)
               .WithOne(q => q.Test)
               .HasForeignKey(q => q.TestId)
               .OnDelete(DeleteBehavior.Cascade);

        // UPDATED: Filter must check if LessonContent is null before checking Course status
        builder.HasQueryFilter(t => t.LessonContentId == null || 
               t.LessonContent!.Lesson.Course.Status != CourseStatus.Closed);
    }
}