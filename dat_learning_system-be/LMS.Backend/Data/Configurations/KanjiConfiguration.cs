using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LMS.Backend.Data.Entities;

namespace LMS.Backend.Data.Configurations
{
    public class KanjiConfiguration : IEntityTypeConfiguration<Kanji>
    {
        public void Configure(EntityTypeBuilder<Kanji> builder)
        {
            builder.ToTable("Kanjis");

            builder.HasKey(k => k.Id);

            builder.Property(k => k.Character)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(k => k.JlptLevel)
                .IsRequired()
                .HasMaxLength(2);

            // One-to-Many relationship
            builder.HasMany(k => k.Examples)
                .WithOne(e => e.Kanji)
                .HasForeignKey(e => e.KanjiId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}