using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Bakcend.Data.Configurations;

public class UserBookProgressConfiguration : IEntityTypeConfiguration<UserBookProgress>
{
    public void Configure(EntityTypeBuilder<UserBookProgress> builder)
    {
        builder.HasKey(a => a.Id);

        // CRITICAL: Unique constraint to prevent duplicate tracking rows
        builder.HasIndex(a => new { a.UserId, a.EBookId }).IsUnique();

        builder.Property(a => a.TotalMinutesSpent).HasDefaultValue(0);
        builder.Property(a => a.HasDownloaded).HasDefaultValue(false);
        builder.Property(a => a.HasOpened).HasDefaultValue(false);

        // Relationship: If a book is deleted, we usually want to keep activity 
        // for logs, or use DeleteBehavior.Cascade if you want a clean wipe.
        builder.HasOne(a => a.EBook)
               .WithMany() 
               .HasForeignKey(a => a.EBookId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}