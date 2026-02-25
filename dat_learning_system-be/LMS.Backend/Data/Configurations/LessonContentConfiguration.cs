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

        // Use nvarchar(max) or text depending on your DB provider (SQL Server vs PostgreSQL)
        // For SQL Server, nvarchar(max) is usually preferred over 'text'
        builder.Property(c => c.Body).IsRequired(false);

        // Relationship: Content -> Lesson
        builder.HasOne(lc => lc.Lesson)
               .WithMany(l => l.Contents)
               .HasForeignKey(lc => lc.LessonId)
               .OnDelete(DeleteBehavior.Cascade);

        // One-to-One with Test
        // This ensures that when a Content block of type 'test' is deleted, 
        // the Questions and Options are cleared via Cascade.
        builder.HasOne(lc => lc.Test)
               .WithOne(t => t.LessonContent)
               .HasForeignKey<Test>(t => t.LessonContentId)
               .OnDelete(DeleteBehavior.Cascade);

        // Optimization: Index LessonId + SortOrder
        // We always fetch contents FOR a lesson IN ORDER.
        builder.HasIndex(c => new { c.LessonId, c.SortOrder });

        builder.HasQueryFilter(lc => lc.Lesson.Course.Status != CourseStatus.Closed);
    }
}
