using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;
public class QuestionOptionConfiguration : IEntityTypeConfiguration<QuestionOption>
{
    public void Configure(EntityTypeBuilder<QuestionOption> builder)
    {
        builder.HasKey(o => o.Id);
        builder.Property(o => o.OptionText).IsRequired().HasMaxLength(500);
        builder.Property(o => o.IsCorrect).HasDefaultValue(false);

        builder.HasQueryFilter(o => o.Question.Test.LessonContent.Lesson.Course.Status != CourseStatus.Closed);
    }
}