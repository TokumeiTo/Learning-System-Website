using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;
public class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.HasKey(q => q.Id);
        builder.Property(q => q.QuestionText).IsRequired().HasColumnType("text");
        builder.Property(q => q.Points).HasDefaultValue(1);

        // Question -> Options (One-to-Many)
        builder.HasMany(q => q.Options)
               .WithOne(o => o.Question)
               .HasForeignKey(o => o.QuestionId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(q => q.Test.LessonContent.Lesson.Course.Status != CourseStatus.Closed);
    }
}