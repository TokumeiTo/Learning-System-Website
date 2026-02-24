using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

// Data/Configurations/LessonContentConfiguration.cs
public class LessonContentConfiguration : IEntityTypeConfiguration<LessonContent>
{
    public void Configure(EntityTypeBuilder<LessonContent> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.ContentType).IsRequired().HasMaxLength(50);
        builder.Property(c => c.Body).IsRequired(false).HasColumnType("text");

        // Relationship
        builder.HasOne(lc => lc.Lesson)
               .WithMany(l => l.Contents)
               .HasForeignKey(lc => lc.LessonId)
               .OnDelete(DeleteBehavior.Cascade);

        // One-to-One with Test
        builder.HasOne(lc => lc.Test)
               .WithOne(t => t.LessonContent)
               .HasForeignKey<Test>(t => t.LessonContentId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(c => c.SortOrder);

        builder.HasQueryFilter(lc => lc.Lesson.Course.Status != CourseStatus.Closed);
    }
}
