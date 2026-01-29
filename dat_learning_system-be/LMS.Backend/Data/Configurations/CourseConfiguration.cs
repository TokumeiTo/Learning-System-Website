using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class CourseConfiguration : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {
        builder.HasKey(c => c.Id);

        // Enums to String conversion
        builder.Property(c => c.Badge).HasConversion<string>().HasMaxLength(20);
        builder.Property(c => c.Status).HasConversion<string>().HasMaxLength(20);

        // Category is a flexible string for "Custom" input
        builder.Property(c => c.Category).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Title).IsRequired().HasMaxLength(200);

        // Global Query Filter for Soft Delete (Closed courses)
        builder.HasQueryFilter(c => c.Status != CourseStatus.Closed);

        // Relationship: Course -> Lessons
        builder.HasMany(c => c.Lessons)
               .WithOne(l => l.Course)
               .HasForeignKey(l => l.CourseId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}