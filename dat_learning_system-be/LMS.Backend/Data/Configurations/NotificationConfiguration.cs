using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.HasKey(n => n.Id);

        builder.Property(n => n.Title).IsRequired().HasMaxLength(200);
        builder.Property(n => n.Message).IsRequired();
        builder.Property(n => n.Type).IsRequired().HasMaxLength(50);

        // Relationship: Notification -> Recipient (ApplicationUser)
        builder.HasOne(n => n.Recipient)
               .WithMany()
               .HasForeignKey(n => n.RecipientId)
               .OnDelete(DeleteBehavior.Cascade);

        // Relationship: Notification -> Sender (ApplicationUser)
        builder.HasOne(n => n.Sender)
               .WithMany()
               .HasForeignKey(n => n.SenderId)
               .OnDelete(DeleteBehavior.SetNull);

        // Index for performance when fetching a user's notification list
        builder.HasIndex(n => n.RecipientId);
        builder.HasIndex(n => n.CreatedAt);
    }
}