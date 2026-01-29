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

        // Relationship: Lesson -> Content Blocks
        builder.HasMany(l => l.Contents)
               .WithOne()
               .HasForeignKey(c => c.LessonId)
               .OnDelete(DeleteBehavior.Cascade);

        // Index for performance when sorting sidebar
        builder.HasIndex(l => l.SortOrder);

        // Add Lesson configuration
        builder.HasQueryFilter(l => l.Course.Status != CourseStatus.Closed);
    }
}