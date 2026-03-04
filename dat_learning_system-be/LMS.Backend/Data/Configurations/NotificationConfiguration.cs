using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.HasKey(n => n.Id);

        builder.Property(n => n.Title).IsRequired().HasMaxLength(150);
        builder.Property(n => n.Message).IsRequired().HasMaxLength(1000);

        // Optimization: Index for the user's inbox query
        builder.HasIndex(n => n.UserId);
        
        // Optimization: Index for the 30-day cleanup background job
        builder.HasIndex(n => n.CreatedAt);

        builder.HasOne(n => n.User)
               .WithMany() // Or add ICollection<Notification> to ApplicationUser if you want
               .HasForeignKey(n => n.UserId)
               .OnDelete(DeleteBehavior.Cascade); // If user is deleted, notifications go too
    }
}