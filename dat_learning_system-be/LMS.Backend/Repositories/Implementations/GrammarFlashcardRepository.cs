using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;

namespace LMS.Backend.Repo.Implement;

public class GrammarFlashcardRepository : IGrammarFlashcardRepository
{
    private readonly AppDbContext _context;

    public GrammarFlashcardRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Grammar>> GetAllByLevelAsync(string level)
    {
        return await _context.Grammars
            .Where(g => g.JlptLevel == level)
            .OrderBy(g => g.Title)
            .ToListAsync();
    }

    public async Task<Grammar?> GetByIdWithExamplesAsync(Guid id)
    {
        return await _context.Grammars
            .Include(g => g.Examples)
            .FirstOrDefaultAsync(g => g.Id == id);
    }

    public async Task AddAsync(Guid id, Grammar grammar)
    {
        grammar.Id = id;
        await _context.Grammars.AddAsync(grammar);
    }

    public async Task UpdateAsync(Grammar grammar)
    {
        // Tracking is handled by EF; we just ensure the state is Modified
        _context.Entry(grammar).State = EntityState.Modified;
    }

    public async Task DeleteAsync(Guid id)
    {
        var grammar = await _context.Grammars.FindAsync(id);
        if (grammar != null)
        {
            _context.Grammars.Remove(grammar);
        }
    }

    public async Task<bool> SaveChangesAsync()
    {
        return (await _context.SaveChangesAsync()) > 0;
    }
}