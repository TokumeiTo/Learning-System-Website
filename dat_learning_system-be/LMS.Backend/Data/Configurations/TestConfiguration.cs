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

        // Test -> Questions (One-to-Many)
        builder.HasMany(t => t.Questions)
               .WithOne(q => q.Test)
               .HasForeignKey(q => q.TestId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(t => t.LessonContent.Lesson.Course.Status != CourseStatus.Closed);
    }
}