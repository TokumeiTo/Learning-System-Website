using LMS.Backend.DTOs.Flashcard;

namespace LMS.Backend.Services.Interfaces
{
    public interface IKanjiFlashcardService
    {
        Task<IEnumerable<KanjiDto>> GetAllKanjisAsync(string? level = null);
        Task<KanjiDto?> GetKanjiByIdAsync(Guid id);
        Task<KanjiDto> CreateKanjiAsync(KanjiCreateUpdateDto dto);
        
        Task<bool> UpdateKanjiAsync(Guid id, KanjiCreateUpdateDto dto);
        
        Task<bool> DeleteKanjiAsync(Guid id);
    }
}