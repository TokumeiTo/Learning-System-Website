using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class AnnouncementConfiguration : IEntityTypeConfiguration<Announcement>
{
    public void Configure(EntityTypeBuilder<Announcement> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Title).IsRequired().HasMaxLength(200);
        builder.Property(a => a.Content).IsRequired().HasMaxLength(2000);
        
        // TargetPosition is an Enum, EF stores it as an int by default.
        builder.Property(a => a.TargetPosition).IsRequired(false);

        // Link to the Admin who created it
        builder.HasOne(a => a.CreatedByUser)
               .WithMany() 
               .HasForeignKey(a => a.CreatedByUserId)
               .OnDelete(DeleteBehavior.Restrict); // Don't delete announcements if admin is deleted
    }
}