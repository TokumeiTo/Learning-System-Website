using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class TestAttemptConfiguration : IEntityTypeConfiguration<TestAttempt>
{
    public void Configure(EntityTypeBuilder<TestAttempt> builder)
    {
        builder.HasKey(la => la.Id);
        builder.Property(la => la.UserId).IsRequired();

        // 1. Percentage Precision
        builder.Property(la => la.Percentage).HasColumnType("decimal(5,2)");

        // 2. Relationships
        // Test is REQUIRED (Not Null)
        builder.HasOne(la => la.Test)
               .WithMany()
               .HasForeignKey(la => la.TestId)
               .IsRequired() // Explicitly required
               .OnDelete(DeleteBehavior.Restrict);

        // Lesson is OPTIONAL (Allow Null for Global Quizzes)
        builder.HasOne(la => la.Lesson)
               .WithMany(l => l.TestAttempts)
               .HasForeignKey(la => la.LessonId)
               .IsRequired(false) // This is the key change
               .OnDelete(DeleteBehavior.SetNull);

        // 3. Performance Indexing
        // This index helps the Dashboard quickly find "Passed" tests for a user
        builder.HasIndex(la => new { la.UserId, la.TestId, la.IsPassed })
               .HasDatabaseName("IX_User_Quiz_Completion");

        // Keep your original audit index but make LessonId optional
        builder.HasIndex(la => new { la.UserId, la.LessonId, la.AttemptedAt })
               .HasDatabaseName("IX_User_Lesson_Audit");

        // 4. Query Filter Fix
        // We allow the record if it's a Global Quiz (Lesson == null) 
        // OR if the associated Course is not closed.
        builder.HasQueryFilter(la => la.Lesson == null || la.Lesson.Course.Status != CourseStatus.Closed);
    }
}