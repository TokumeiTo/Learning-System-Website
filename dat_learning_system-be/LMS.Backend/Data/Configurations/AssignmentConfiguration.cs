using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class AssignmentConfiguration : IEntityTypeConfiguration<Assignment>
{
    public void Configure(EntityTypeBuilder<Assignment> builder)
    {
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Title).IsRequired().HasMaxLength(200);

        // Use 'text' for long instructions in Postgres
        builder.Property(a => a.Description).HasColumnType("text");

        // Topic 1 -> Many Assignments
        builder.HasOne(a => a.Topic)
               .WithMany(t => t.Assignments)
               .HasForeignKey(a => a.TopicId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(a => a.Topic.Course.Status != CourseStatus.Closed);
    }
}