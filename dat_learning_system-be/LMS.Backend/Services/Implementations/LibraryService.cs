using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Library;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class LibraryService(
    ILibraryRepository repo,
    IMapper mapper,
    IFileService fileService,
    IWebHostEnvironment env) : ILibraryService
{
    #region Public Student Methods

    public async Task<IEnumerable<EBookResponseDto>> GetAllBooksAsync(string? category = null)
    {
        var books = await repo.GetAllBooksAsync(category);
        return mapper.Map<IEnumerable<EBookResponseDto>>(books);
    }

    public async Task<PagedLibraryResponseDto> GetPagedBooksAsync(
        string userId,
        string? category,
        string? search,
        bool? isActive,
        int page,
        int pageSize)
    {
        // 1. Get books from Repo
        var (books, totalCount) = await repo.GetAllPagedAsync(category, search, isActive, page, pageSize);

        // 2. Get all progress for this user
        var userProgressList = await repo.GetUserProgressListAsync(userId);

        // 3. Map Books to DTOs
        var items = mapper.Map<List<EBookResponseDto>>(books);

        // 4. Match them up
        foreach (var item in items)
        {
            var progressRecord = userProgressList.FirstOrDefault(p => p.EBookId == item.Id);
            if (progressRecord != null)
            {
                // Map the specific progress record to the DTO property
                item.UserProgress = mapper.Map<UserBookProgressDto>(progressRecord);
            }
        }

        return new PagedLibraryResponseDto
        {
            Items = items,
            TotalCount = totalCount,
            CurrentPage = page,
            PageSize = pageSize
        };
    }

    public async Task<LibraryStatsDto> GetUserStatsAsync(string userId)
    {
        return await repo.GetUserStatsAsync(userId);
    }

    public async Task<EBookResponseDto?> GetBookByIdAsync(int id)
    {
        var book = await repo.GetBookByIdAsync(id);
        return book == null ? null : mapper.Map<EBookResponseDto>(book);
    }

    public async Task<UserBookProgressDto?> GetUserProgressAsync(string userId, int bookId)
    {
        var progress = await repo.GetUserActivityAsync(userId, bookId);
        return progress == null ? null : mapper.Map<UserBookProgressDto>(progress);
    }

    public async Task RecordActivityAsync(string userId, BookActivityRequestDto activity)
    {
        await repo.UpdateActivityAsync(
            userId,
            activity.EBookId,
            activity.MinutesToAdd,
            activity.IsDownloading,
            activity.IsOpening
        );
    }

    public async Task<FileDownloadModel?> PrepareDownloadAsync(int id)
    {
        var book = await repo.GetBookByIdAsync(id);
        if (book == null) return null;

        // Logic for path resolution
        var relativePath = book.FileUrl.TrimStart('/');
        var physicalPath = Path.Combine(env.WebRootPath, relativePath);

        if (!File.Exists(physicalPath)) return null;

        // Prepare return object
        var fileName = $"{book.Title}{Path.GetExtension(book.FileUrl)}";
        return new FileDownloadModel(physicalPath, "application/pdf", fileName);
    }

    #endregion

    #region Public Admin CRUD Methods

    public async Task<EBookResponseDto> CreateBookAsync(EBookRequestDto request)
    {
        // Handle binary files directly from FormData
        if (request.ThumbnailFile != null)
            request.ThumbnailUrl = await fileService.UploadFileAsync(request.ThumbnailFile, "images");

        if (request.EBookFile != null)
            request.FileUrl = await fileService.UploadAndOptimizePdf(request.EBookFile);

        var bookEntity = mapper.Map<EBook>(request);
        var createdBook = await repo.CreateBookAsync(bookEntity);

        return mapper.Map<EBookResponseDto>(createdBook);
    }

    public async Task<bool> UpdateBookAsync(int id, EBookRequestDto request)
    {
        // 1. Get the current state from the DB (tracked by EF)
        var existingBook = await repo.GetBookByIdAsync(id);
        if (existingBook == null) return false;

        // 2. Handle Thumbnail Update
        if (request.ThumbnailFile != null)
        {
            // Delete old file if it exists
            if (!string.IsNullOrEmpty(existingBook.ThumbnailUrl))
                fileService.DeleteFile(existingBook.ThumbnailUrl);

            request.ThumbnailUrl = await fileService.UploadFileAsync(request.ThumbnailFile, "images");
        }
        else
        {
            request.ThumbnailUrl = existingBook.ThumbnailUrl;
        }

        // 3. Handle PDF Update
        if (request.EBookFile != null)
        {
            // Delete old PDF if it exists
            if (!string.IsNullOrEmpty(existingBook.FileUrl))
                fileService.DeleteFile(existingBook.FileUrl);

            request.FileUrl = await fileService.UploadAndOptimizePdf(request.EBookFile);
        }
        else
        {
            request.FileUrl = existingBook.FileUrl;
        }

        // 4. Map DTO to the tracked Entity
        existingBook.Title = request.Title;
        existingBook.Author = request.Author;
        existingBook.Category = request.Category;
        existingBook.Description = request.Description;
        existingBook.IsActive = request.IsActive;

        // 5. Save changes via Repo
        return await repo.UpdateBookAsync(existingBook);
    }

    public async Task<bool> DeleteBookAsync(int id)
    {
        var book = await repo.GetBookByIdAsync(id);
        if (book == null) return false;

        // Delete physical files
        fileService.DeleteFile(book.ThumbnailUrl);
        fileService.DeleteFile(book.FileUrl);

        return await repo.DeleteBookAsync(id);
    }

    #endregion
}