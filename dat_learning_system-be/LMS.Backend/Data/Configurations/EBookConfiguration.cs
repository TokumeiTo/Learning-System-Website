using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class EBookConfiguration : IEntityTypeConfiguration<EBook>
{
    public void Configure(EntityTypeBuilder<EBook> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Title).IsRequired().HasMaxLength(255);
        builder.Property(e => e.Author).HasMaxLength(150);
        builder.Property(e => e.Category).IsRequired().HasMaxLength(50);
        builder.Property(e => e.Description).HasMaxLength(2000); // Added limit
        
        // Speed up the "Filter by Category" logic
        builder.HasIndex(e => e.Category);
        
        // Default values
        builder.Property(e => e.TotalDownloadCount).HasDefaultValue(0);
        builder.Property(e => e.TotalReaderCount).HasDefaultValue(0);
        builder.Property(e => e.AverageRating).HasDefaultValue(0.0);
        builder.Property(e => e.IsActive).HasDefaultValue(true);
    }
}