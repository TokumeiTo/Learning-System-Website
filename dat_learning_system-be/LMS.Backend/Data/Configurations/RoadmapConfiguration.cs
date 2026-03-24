using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class RoadMapConfiguration : IEntityTypeConfiguration<RoadMap>
{
    public void Configure(EntityTypeBuilder<RoadMap> builder)
    {
        builder.HasKey(rm => rm.Id);

        builder.Property(rm => rm.Title).IsRequired().HasMaxLength(200);
        builder.Property(rm => rm.Description).HasColumnType("text");
        builder.Property(rm => rm.TargetRole).HasMaxLength(100);

        // RoadMap -> RoadmapSteps (One-to-Many)
        builder.HasMany(rm => rm.Steps)
               .WithOne(s => s.RoadMap)
               .HasForeignKey(s => s.RoadMapId)
               .OnDelete(DeleteBehavior.Cascade);

        // Index for performance when listing roadmaps by creation date
        builder.HasIndex(rm => rm.CreatedAt);
    }
}