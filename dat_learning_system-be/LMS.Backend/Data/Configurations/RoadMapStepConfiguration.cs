using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class RoadmapStepConfiguration : IEntityTypeConfiguration<RoadmapStep>
{
    public void Configure(EntityTypeBuilder<RoadmapStep> builder)
    {
        builder.HasKey(rs => rs.Id);

        builder.Property(rs => rs.Title).IsRequired().HasMaxLength(255);
        builder.Property(rs => rs.Content).HasColumnType("text");
        builder.Property(rs => rs.NodeType).HasMaxLength(50).HasDefaultValue("Instruction");

        // Essential for the vertical Roadmap UI sequence
        builder.HasIndex(rs => new { rs.RoadMapId, rs.SortOrder });

        // Optional link to EBook - We use Restrict/SetNull so deleting 
        // a book doesn't break the roadmap guide.
        builder.Property(rs => rs.LinkedResourceId)
                .HasMaxLength(255) // Give it enough space for GUID strings
                .IsRequired(false);
    }
}