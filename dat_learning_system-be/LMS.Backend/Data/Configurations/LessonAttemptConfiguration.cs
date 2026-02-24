using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;
public class LessonAttemptConfiguration : IEntityTypeConfiguration<LessonAttempt>
{
    public void Configure(EntityTypeBuilder<LessonAttempt> builder)
    {
        builder.HasKey(la => la.Id);
        builder.Property(la => la.UserId).IsRequired();
        
        // Ensure percentage is stored with enough precision
        builder.Property(la => la.Percentage).HasColumnType("decimal(5,2)"); 

        builder.HasIndex(la => new { la.UserId, la.LessonId });

        builder.HasQueryFilter(la => la.Lesson.Course.Status != CourseStatus.Closed);
    }
}