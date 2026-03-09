using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;
public class OnomatopoeiaConfig : IEntityTypeConfiguration<Onomatopoeia>
{
    public void Configure(EntityTypeBuilder<Onomatopoeia> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Phrase).IsRequired().HasMaxLength(100);
        
        // Manual Sync Relationship
        builder.HasMany(x => x.Examples)
               .WithOne()
               .HasForeignKey(x => x.OnomatopoeiaId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}