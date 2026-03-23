using LMS.Backend.DTOs.Library;

namespace LMS.Backend.Services.Interfaces;

public interface ILibraryService
{
    Task<IEnumerable<EBookResponseDto>> GetAllBooksAsync(string? category = null);
    Task<PagedLibraryResponseDto> GetPagedBooksAsync(string? category, string? search, int page, int pageSize);
    Task<EBookResponseDto?> GetBookByIdAsync(int id);
    Task<EBookResponseDto> CreateBookAsync(EBookRequestDto request);
    Task<bool> UpdateBookAsync(int id, EBookRequestDto request);
    Task<bool> DeleteBookAsync(int id);

    // Activity
    Task RecordActivityAsync(string userId, BookActivityRequestDto activity);
    Task<UserBookProgressDto?> GetUserProgressAsync(string userId, int bookId);
    Task<FileDownloadModel?> PrepareDownloadAsync(int id);
}