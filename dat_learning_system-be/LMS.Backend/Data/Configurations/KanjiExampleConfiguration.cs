using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LMS.Backend.Data.Entities;

namespace LMS.Backend.Data.Configurations
{
    public class KanjiExampleConfiguration : IEntityTypeConfiguration<KanjiExample>
    {
        public void Configure(EntityTypeBuilder<KanjiExample> builder)
        {
            builder.ToTable("KanjiExamples");

            builder.HasKey(e => e.Id);

            // The word being taught (e.g., "日本")
            builder.Property(e => e.Word)
                .IsRequired()
                .HasMaxLength(100);

            // The reading (e.g., "にほん")
            builder.Property(e => e.Reading)
                .IsRequired()
                .HasMaxLength(200);

            // The translation/meaning
            builder.Property(e => e.Meaning)
                .IsRequired()
                .HasMaxLength(500);

            // Explicitly defining the FK (though already defined in KanjiConfig, 
            // it's cleaner to be explicit here for documentation purposes)
            builder.HasOne(e => e.Kanji)
                .WithMany(k => k.Examples)
                .HasForeignKey(e => e.KanjiId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}