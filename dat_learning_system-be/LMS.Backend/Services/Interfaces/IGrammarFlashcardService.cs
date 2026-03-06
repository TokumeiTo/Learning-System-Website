using LMS.Backend.DTOs.Flashcard;

namespace LMS.Backend.Services.Interfaces;

public interface IGrammarFlashcardService
{
    // Returns DTOs to the Controller for the UI
    Task<IEnumerable<GrammarDto>> GetAllByLevelAsync(string level);
    Task<GrammarDto?> GetByIdAsync(Guid id);

    // Accepts DTOs from the Controller
    Task CreateGrammarAsync(GrammarCreateUpdateDto dto);
    Task UpdateGrammarAsync(Guid id, GrammarCreateUpdateDto dto);
    Task DeleteGrammarAsync(Guid id);
}