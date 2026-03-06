using System.ComponentModel.DataAnnotations;

namespace LMS.Backend.Data.Entities;

public class Grammar
{
    public Guid Id { get; set; }
    
    [Required]
    public string Title { get; set; } = string.Empty; // e.g., "〜ながら"
    
    [Required]
    public string JlptLevel { get; set; } = "N5"; // N5, N4, etc.
    
    [Required]
    public string Meaning { get; set; } = string.Empty;
    
    [Required]
    public string Structure { get; set; } = string.Empty; // e.g., "Verb (ます stem) + ながら"
    
    [Required]
    public string Explanation { get; set; } = string.Empty;

    // Relationship: One Grammar point has many Examples
    public List<GrammarExample> Examples { get; set; } = new();
}

public class GrammarExample
{
    public Guid Id { get; set; }
    
    [Required]
    public string Jp { get; set; } = string.Empty;
    
    public string Romaji { get; set; } = string.Empty;
    
    [Required]
    public string En { get; set; } = string.Empty;

    // Foreign Key
    public Guid GrammarId { get; set; }
}