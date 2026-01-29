using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class TopicConfiguration : IEntityTypeConfiguration<Topic>
{
    public void Configure(EntityTypeBuilder<Topic> builder)
    {
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Title).IsRequired().HasMaxLength(200);

        // Course 1 -> Many Topics
        builder.HasOne(t => t.Course)
               .WithMany(c => c.Topics) // Or add ICollection<Topic> to Course entity if you want
               .HasForeignKey(t => t.CourseId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(t => t.Course.Status != CourseStatus.Closed);
    }
}