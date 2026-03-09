using LMS.Backend.DTOs.Flashcard;

namespace LMS.Backend.Services.Interfaces;

public interface IOnomatoService
{
    Task<IEnumerable<OnomatoResponseDto>> GetAllAsync();
    Task<OnomatoResponseDto?> GetByIdAsync(int id);
    Task<OnomatoResponseDto> UpsertAsync(OnomatoUpsertRequestDto request);
    Task<bool> DeleteAsync(int id);
}