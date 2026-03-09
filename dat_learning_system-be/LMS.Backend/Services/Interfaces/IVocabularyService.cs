using LMS.Backend.DTOs.Flashcard;

namespace LMS.Backend.Services.Interfaces;

public interface IVocabularyService
{
    Task<IEnumerable<VocabResponseDto>> GetLevelListAsync(string level);
    Task<VocabResponseDto?> GetDetailAsync(Guid id);
    Task<VocabResponseDto> UpsertAsync(VocabUpsertRequestDto dto);
    Task<bool> DeleteAsync(Guid id);
}