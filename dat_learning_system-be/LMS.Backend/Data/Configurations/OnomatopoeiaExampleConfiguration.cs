using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class OnomatopoeiaExampleConfig : IEntityTypeConfiguration<OnomatopoeiaExample>
{
    public void Configure(EntityTypeBuilder<OnomatopoeiaExample> builder)
    {
        builder.HasKey(x => x.Id);

        // Ensure we don't save empty examples
        builder.Property(x => x.Japanese).IsRequired().HasMaxLength(1000);
        builder.Property(x => x.English).IsRequired().HasMaxLength(1000);

        // This links back to the parent
        builder.HasOne<Onomatopoeia>()
               .WithMany(x => x.Examples)
               .HasForeignKey(x => x.OnomatopoeiaId)
               .OnDelete(DeleteBehavior.Cascade); 
    }
}