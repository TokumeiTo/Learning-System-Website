using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class QuizItemConfiguration : IEntityTypeConfiguration<QuizItem>
{
    public void Configure(EntityTypeBuilder<QuizItem> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.SourceId).IsRequired().HasMaxLength(100);
        builder.Property(q => q.DisplayMode).HasConversion<string>();

        // We use .HasColumnType("text") or a high MaxLength for Reading passages
        builder.Property(q => q.CustomPrompt).HasMaxLength(2000);

        builder.HasOne(q => q.Test)
               .WithMany(t => t.QuizItems)
               .HasForeignKey(q => q.TestId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(qi => !qi.Test.LessonContentId.HasValue ||
        qi.Test.LessonContent!.Lesson.Course.Status != CourseStatus.Closed);
    }
}
public class QuizSessionConfiguration : IEntityTypeConfiguration<QuizSession>
{
    public void Configure(EntityTypeBuilder<QuizSession> builder)
    {
        builder.HasKey(s => s.Id);
        builder.Property(s => s.UserId).IsRequired();

        builder.HasOne(s => s.Test)
               .WithMany(t => t.Sessions)
               .HasForeignKey(s => s.TestId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(s => s.Answers)
               .WithOne(a => a.Session)
               .HasForeignKey(a => a.QuizSessionId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(qs => !qs.Test.LessonContentId.HasValue ||
               qs.Test.LessonContent!.Lesson.Course.Status != CourseStatus.Closed);
    }
}
public class QuizSessionAnswerConfiguration : IEntityTypeConfiguration<QuizSessionAnswer>
{
    public void Configure(EntityTypeBuilder<QuizSessionAnswer> builder)
    {
        builder.HasKey(a => a.Id);

        builder.HasOne(a => a.QuizItem)
               .WithMany() // We don't necessarily need a collection of answers inside QuizItem
               .HasForeignKey(a => a.QuizItemId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.Property(a => a.UserAnswer).IsRequired();

        builder.HasQueryFilter(qsa =>
            !qsa.Session.Test.LessonContentId.HasValue ||
             qsa.Session.Test.LessonContent!.Lesson.Course.Status != CourseStatus.Closed);
    }
}