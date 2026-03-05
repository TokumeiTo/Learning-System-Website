using LMS.Backend.DTOs.Flashcard;

namespace LMS.Backend.Services.Interfaces
{
    public interface IKanjiFlashcardService
    {
        Task<IEnumerable<KanjiDto>> GetAllKanjisAsync(string? level = null);
        Task<KanjiDto?> GetKanjiByIdAsync(Guid id);
        Task<KanjiDto> CreateKanjiAsync(KanjiCreateUpdateDto dto);
        
        // Following your "Manual Sync" rule
        Task<bool> UpdateKanjiAsync(Guid id, KanjiCreateUpdateDto dto);
        
        Task<bool> DeleteKanjiAsync(Guid id);
    }
}