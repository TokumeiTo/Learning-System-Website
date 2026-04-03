using LMS.Backend.Common;
using LMS.Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LMS.Backend.Data.Configurations;

public class TestConfiguration : IEntityTypeConfiguration<Test>
{
       public void Configure(EntityTypeBuilder<Test> builder)
       {
              builder.HasKey(t => t.Id);

              builder.Property(t => t.Title).HasMaxLength(200).IsRequired();
              builder.Property(t => t.PassingGrade).HasDefaultValue(40);

              builder.HasQueryFilter(t => t.IsActive && (
                     t.LessonContentId == null ||
                     t.LessonContent!.Lesson.Course.Status != CourseStatus.Closed
              ));

              builder.HasIndex(t => new { t.Title, t.Version, t.IsGlobal }).IsUnique();
       }
}