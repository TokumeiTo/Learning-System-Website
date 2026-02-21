using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class CourseRatingConfiguration : IEntityTypeConfiguration<CourseRating>
{
    public void Configure(EntityTypeBuilder<CourseRating> builder)
    {
        builder.HasKey(r => r.Id);
        builder.HasQueryFilter(r => r.Course.Status != CourseStatus.Closed);

        // This is the most important line: 
        // Prevents a user from rating the same course multiple times.
        builder.HasIndex(r => new { r.UserId, r.CourseId }).IsUnique();

        builder.Property(r => r.Score).IsRequired();
        builder.Property(r => r.Comment).HasMaxLength(100);

        // Relationship: If a Course is deleted, delete its ratings (Cascade)
        builder.HasOne(r => r.Course)
               .WithMany() 
               .HasForeignKey(r => r.CourseId)
               .OnDelete(DeleteBehavior.Cascade);

        // Relationship: If a User is deleted, delete their ratings
        builder.HasOne(r => r.User)
               .WithMany()
               .HasForeignKey(r => r.UserId);
    }
}