using LMS.Backend.DTOs.Translation;

namespace LMS.Backend.Services.Interfaces;
public interface ITranslationService
{
    Task<TranslationResponseDto> TranslateAsync(TranslationRequestDto dto);
}