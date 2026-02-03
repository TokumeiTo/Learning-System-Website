using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class EnrollmentConfiguration : IEntityTypeConfiguration<Enrollment>
{
    public void Configure(EntityTypeBuilder<Enrollment> builder)
    {
        builder.HasKey(e => e.Id);

        // Status: Pending, Approved, Rejected
        builder.Property(e => e.Status)
            .IsRequired()
            .HasMaxLength(20)
            .HasDefaultValue("Pending");

        // prevent a user from enrolling in the same course more than once
        builder.HasIndex(e => new { e.UserId, e.CourseId })
            .IsUnique();

        // Relationship: User -> Enrollments
        builder.HasOne(e => e.User)
            .WithMany() // Or add ICollection<Enrollment> to ApplicationUser if you want navigation back
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.NoAction); // We don't want to delete users if enrollment is cleared

        // Relationship: Course -> Enrollments
        builder.HasOne(e => e.Course)
            .WithMany() // Or add ICollection<Enrollment> to Course for easy counting
            .HasForeignKey(e => e.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(e => e.Course.Status != CourseStatus.Closed);
    }
}