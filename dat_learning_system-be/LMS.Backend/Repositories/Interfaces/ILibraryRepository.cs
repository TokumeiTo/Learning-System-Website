using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Library;

namespace LMS.Backend.Repo.Interface;

public interface ILibraryRepository
{
    // Admin CRUD
    Task<IEnumerable<EBook>> GetAllBooksAsync(string? category = null);
    Task<EBook?> GetBookByIdAsync(int id);
    Task<EBook> CreateBookAsync(EBook book);
    Task<bool> UpdateBookAsync(EBook book);
    Task<bool> DeleteBookAsync(int id);
    Task<(IEnumerable<EBook> Items, int TotalCount)> GetAllPagedAsync(string? category, string? search, int page, int pageSize);

    // Activity & Tracking
    Task UpdateActivityAsync(string userId, int bookId, double minutesToAdd, bool? isDownloading = null, bool? isOpening = null);
    Task<UserBookProgress?> GetUserActivityAsync(string userId, int bookId);
    Task<LibraryStatsDto> GetUserStatsAsync(string userId)
;
}