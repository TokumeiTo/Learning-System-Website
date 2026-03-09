using LMS.Backend.Data;
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class VocabularyRepository : IVocabularyRepository
{
    private readonly AppDbContext _context;

    public VocabularyRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Vocabulary>> GetAllByLevelAsync(string level)
    {
        // For the "Thin" list view, we don't necessarily need Include(Examples) 
        // to save bandwidth, but we'll add it if you want the full data immediately.
        return await _context.Vocabularies
            .Where(v => v.JLPTLevel == level)
            .OrderBy(v => v.Word)
            .ToListAsync();
    }

    public async Task<Vocabulary?> GetByIdAsync(Guid id)
    {
        return await _context.Vocabularies
            .Include(v => v.Examples) // Essential for the Detail Modal
            .FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Vocabularies.AnyAsync(v => v.Id == id);
    }

    public async Task AddAsync(Vocabulary vocabulary)
    {
        await _context.Vocabularies.AddAsync(vocabulary);
    }

    public void Update(Vocabulary vocabulary)
    {
        _context.Vocabularies.Update(vocabulary);
    }

    public void Delete(Vocabulary vocabulary)
    {
        _context.Vocabularies.Remove(vocabulary);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return (await _context.SaveChangesAsync()) > 0;
    }
}