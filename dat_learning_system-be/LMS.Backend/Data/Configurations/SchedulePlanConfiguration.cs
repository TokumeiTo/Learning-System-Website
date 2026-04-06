using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LMS.Backend.Data.Entities;

namespace LMS.Backend.Data.Configurations;

public class SchedulePlanConfiguration : IEntityTypeConfiguration<SchedulePlan>
{
    public void Configure(EntityTypeBuilder<SchedulePlan> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Title).IsRequired().HasMaxLength(100);
        builder.Property(s => s.ActivityType).IsRequired().HasMaxLength(20);
        
        builder.Property(s => s.Color).HasDefaultValue("#6366f1");

        builder.HasIndex(s => s.StartTime);
        builder.HasIndex(s => s.IsPublic);
    }
}