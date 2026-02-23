using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class UserLessonProgressConfiguration : IEntityTypeConfiguration<UserLessonProgress>
{
    public void Configure(EntityTypeBuilder<UserLessonProgress> builder)
    {
        builder.HasKey(up => up.Id);

        // Ensure one record per user per lesson
        builder.HasIndex(up => new { up.UserId, up.LessonId }).IsUnique();

        builder.Property(up => up.TimeSpentSeconds).HasDefaultValue(0);
        builder.Property(up => up.IsCompleted).HasDefaultValue(false);
        builder.Property(up => up.LastAccessedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(up => up.User)
               .WithMany()
               .HasForeignKey(up => up.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(up => up.Lesson)
               .WithMany()
               .HasForeignKey(up => up.LessonId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(up => up.Lesson.Course.Status != CourseStatus.Closed);
    }
}