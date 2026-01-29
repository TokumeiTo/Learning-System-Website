using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.EntityName).IsRequired().HasMaxLength(100);
        builder.Property(a => a.EntityId).IsRequired().HasMaxLength(100);
        builder.Property(a => a.Action).IsRequired().HasMaxLength(50);
        builder.Property(a => a.Reason).HasMaxLength(500);

        // Configure snapshots to store as MAX text
        builder.Property(a => a.OldData).HasColumnType("text");
        builder.Property(a => a.NewData).HasColumnType("text");

        // Relationship to the Admin who performed the action
        builder.HasOne(a => a.AdminUser)
            .WithMany()
            .HasForeignKey(a => a.PerformedBy)
            .OnDelete(DeleteBehavior.SetNull);
            
        builder.HasIndex(a => a.EntityId); // Index for faster searching of history
    }
}