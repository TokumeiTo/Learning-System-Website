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

        builder.Property(l => l.Title)
               .IsRequired()
               .HasMaxLength(200);

        builder.Property(l => l.Time)
               .HasMaxLength(50); // Optional: good to cap the "7 hrs" string length

        // Relationship: Lesson -> Course (Important for the Query Filter)
        builder.HasOne(l => l.Course)
               .WithMany(c => c.Lessons)
               .HasForeignKey(l => l.CourseId)
               .OnDelete(DeleteBehavior.Cascade);

        // Relationship: Lesson -> Content Blocks
        builder.HasMany(l => l.Contents)
               .WithOne()
               .HasForeignKey(c => c.LessonId)
               .OnDelete(DeleteBehavior.Cascade);

        // Performance: Indexing CourseId and SortOrder together 
        // because we almost always fetch lessons BY Course ORDERED BY SortOrder.
        builder.HasIndex(l => new { l.CourseId, l.SortOrder });

        // Global Query Filter: Prevents lessons from being fetched if the course is closed.
        // Note: Ensure the 'Course' property is included in your queries for this to work.
        builder.HasQueryFilter(l => l.Course.Status != CourseStatus.Closed);
    }
}