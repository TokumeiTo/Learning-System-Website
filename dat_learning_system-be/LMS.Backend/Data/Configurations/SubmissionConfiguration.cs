// Data/Configurations/SubmissionConfiguration.cs
using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class SubmissionConfiguration : IEntityTypeConfiguration<Submission>
{
    public void Configure(EntityTypeBuilder<Submission> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.ContentText).HasColumnType("text");
        builder.Property(s => s.FileUrl).HasMaxLength(500); // URL to storage

        // Assignment 1 -> Many Submissions
        builder.HasOne(s => s.Assignment)
               .WithMany(a => a.Submissions)
               .HasForeignKey(s => s.AssignmentId)
               .OnDelete(DeleteBehavior.Cascade);

        // User (Student) -> Many Submissions
        builder.HasOne(s => s.Student)
               .WithMany()
               .HasForeignKey(s => s.StudentId)
               .OnDelete(DeleteBehavior.Restrict); // Don't delete submissions if a user is deleted

        builder.HasQueryFilter(s => s.Assignment.Topic.Course.Status != CourseStatus.Closed);
    }
}