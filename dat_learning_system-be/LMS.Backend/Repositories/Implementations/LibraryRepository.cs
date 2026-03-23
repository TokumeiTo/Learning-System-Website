using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class LibraryRepository(AppDbContext context) : ILibraryRepository
{
    #region Admin CRUD

    public async Task<IEnumerable<EBook>> GetAllBooksAsync(string? category = null)
    {
        var query = context.EBooks.AsNoTracking();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(b => b.Category == category);

        return await query.OrderByDescending(b => b.CreatedAt).ToListAsync();
    }

    public async Task<EBook?> GetBookByIdAsync(int id)
    {
        return await context.EBooks.FindAsync(id);
    }

    public async Task<(IEnumerable<EBook> Items, int TotalCount)> GetAllPagedAsync(
     string? category,
     string? search, // Add this parameter
     int page,
     int pageSize)
    {
        var query = context.EBooks.AsNoTracking();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(b => b.Category == category);

        // Add server-side search logic
        if (!string.IsNullOrEmpty(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(b =>
                b.Title.ToLower().Contains(searchLower) ||
                b.Author.ToLower().Contains(searchLower));
        }

        int totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(b => b.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<EBook> CreateBookAsync(EBook book)
    {
        book.CreatedAt = DateTime.UtcNow;
        context.EBooks.Add(book);
        await context.SaveChangesAsync();
        return book;
    }

    public async Task<bool> UpdateBookAsync(EBook book)
    {
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteBookAsync(int id)
    {
        var book = await context.EBooks.FindAsync(id);
        if (book == null) return false;

        context.EBooks.Remove(book);
        return await context.SaveChangesAsync() > 0;
    }

    #endregion

    #region Tracking Logic

    public async Task UpdateActivityAsync(string userId, int bookId, double minutesToAdd, bool? isDownloading = null, bool? isOpening = null)
    {
        var activity = await context.UserBookProgresses
            .FirstOrDefaultAsync(a => a.UserId == userId && a.EBookId == bookId);

        var book = await context.EBooks.FindAsync(bookId);
        if (book == null) return;

        if (activity == null)
        {
            activity = new UserBookProgress
            {
                UserId = userId,
                EBookId = bookId,
                TotalMinutesSpent = minutesToAdd,
                HasDownloaded = isDownloading ?? false,
                HasOpened = isOpening ?? false,
                LastAccessedAt = DateTime.UtcNow
            };
            context.UserBookProgresses.Add(activity);

            if (isDownloading == true) book.TotalDownloadCount++;
            if (isOpening == true) book.TotalReaderCount++;
        }
        else
        {
            activity.TotalMinutesSpent += minutesToAdd;
            activity.LastAccessedAt = DateTime.UtcNow;

            if (isDownloading == true && !activity.HasDownloaded)
            {
                activity.HasDownloaded = true;
                book.TotalDownloadCount++;
            }
            if (isOpening == true && !activity.HasOpened)
            {
                activity.HasOpened = true;
                book.TotalReaderCount++;
            }
        }

        await context.SaveChangesAsync();
    }

    public async Task<UserBookProgress?> GetUserActivityAsync(string userId, int bookId)
    {
        return await context.UserBookProgresses
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.UserId == userId && a.EBookId == bookId);
    }

    #endregion
}