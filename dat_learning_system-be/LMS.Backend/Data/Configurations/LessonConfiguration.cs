// Data/Configurations/LessonConfiguration.cs
using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class LessonConfiguration : IEntityTypeConfiguration<Lesson>
{
    public void Configure(EntityTypeBuilder<Lesson> builder)
    {
        builder.HasKey(l => l.Id);

        builder.Property(l => l.Title).IsRequired().HasMaxLength(200);
        builder.Property(l => l.Time).HasMaxLength(70);

        // Lesson -> Course
        builder.HasOne(l => l.Course)
               .WithMany(c => c.Lessons)
               .HasForeignKey(l => l.CourseId)
               .OnDelete(DeleteBehavior.Cascade);

        // Lesson -> Content Blocks
        builder.HasMany(l => l.Contents)
               .WithOne(c => c.Lesson) // Use explicit navigation
               .HasForeignKey(c => c.LessonId)
               .OnDelete(DeleteBehavior.Cascade);

        // Lesson -> Attempts (CRITICAL for your KPI tracking)
        builder.HasMany(l => l.Attempts)
               .WithOne(a => a.Lesson)
               .HasForeignKey(a => a.LessonId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(l => new { l.CourseId, l.SortOrder });

        builder.HasQueryFilter(l => l.Course.Status != CourseStatus.Closed);
    }
}
