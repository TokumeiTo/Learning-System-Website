using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;


namespace LMS.Backend.Repo.Implement;

public class KanjiFlashcardRepository : IKanjiFlashcardRepository
{
    private readonly AppDbContext _context;

    public KanjiFlashcardRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Kanji>> GetAllAsync(string? level = null)
    {
        var query = _context.Kanjis.Include(k => k.Examples).AsQueryable();

        if (!string.IsNullOrEmpty(level))
        {
            query = query.Where(k => k.JlptLevel == level);
        }

        return await query.ToListAsync();
    }

    public async Task<Kanji?> GetByIdAsync(Guid id)
    {
        return await _context.Kanjis
            .Include(k => k.Examples)
            .FirstOrDefaultAsync(k => k.Id == id);
    }

    public async Task AddAsync(Kanji kanji)
    {
        await _context.Kanjis.AddAsync(kanji);
    }

    public void Update(Kanji kanji)
    {
        _context.Kanjis.Update(kanji);
    }

    public void Delete(Kanji kanji)
    {
        _context.Kanjis.Remove(kanji);
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Kanjis.AnyAsync(k => k.Id == id);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return (await _context.SaveChangesAsync() >= 0);
    }
}
