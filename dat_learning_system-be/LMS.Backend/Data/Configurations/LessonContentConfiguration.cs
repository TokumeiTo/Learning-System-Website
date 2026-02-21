using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class LessonContentConfiguration : IEntityTypeConfiguration<LessonContent>
{
    public void Configure(EntityTypeBuilder<LessonContent> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.ContentType).IsRequired().HasMaxLength(50);
        
        builder.Property(c => c.Body).IsRequired().HasColumnType("text");

        // Explicitly link the Navigation Property and the Foreign Key
        builder.HasOne(lc => lc.Lesson)
               .WithMany(l => l.Contents)
               .HasForeignKey(lc => lc.LessonId)
               .OnDelete(DeleteBehavior.Cascade);

        // Index for performance when rendering
        builder.HasIndex(c => c.SortOrder);

        // Global Query Filter for Soft Delete propagation
        builder.HasQueryFilter(lc => lc.Lesson.Course.Status != CourseStatus.Closed);
    }
}