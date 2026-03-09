using System.ComponentModel.DataAnnotations;

namespace LMS.Backend.Data.Entities;

public class Kanji
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(5)]
    public string Character { get; set; } = "N/A"; // "日"

    [Required]
    public string Meaning { get; set; } = "N/A"; // "day, sun"

    public string? Romaji { get; set; }

    public int Strokes { get; set; }

    [Required]
    public string JlptLevel { get; set; } = "N/A"; // N1-N5

    // Storing arrays as semicolon-separated strings for simplicity in SQL 
    // or you could use JSON columns in PG/SQL Server
    public string? Onyomi { get; set; }
    public string? Kunyomi { get; set; }
    public string? Radicals { get; set; }

    // Relationship
    public ICollection<KanjiExample> Examples { get; set; } = new List<KanjiExample>();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class KanjiExample
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Word { get; set; } = string.Empty;

    public string Reading { get; set; } = string.Empty;

    public string Meaning { get; set; } = string.Empty;

    // FK
    public Guid KanjiId { get; set; }
    public Kanji? Kanji { get; set; }
}