using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Repo.Interface;
using Microsoft.EntityFrameworkCore;
namespace LMS.Backend.Repo.Implement;

public class OnomatoRepository : IOnomatoRepository
{
    private readonly AppDbContext _context;

    public OnomatoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Onomatopoeia>> GetAllAsync()
    {
        return await _context.Onomatopoeias
            .Include(x => x.Examples)
            .OrderByDescending(x => x.Id)
            .ToListAsync();
    }

    public async Task<Onomatopoeia?> GetByIdAsync(int id)
    {
        return await _context.Onomatopoeias
            .Include(x => x.Examples)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Onomatopoeia> UpsertAsync(Onomatopoeia incoming)
    {
        // 1. Check if it exists in the DB
        var existing = await _context.Onomatopoeias
            .Include(x => x.Examples)
            .FirstOrDefaultAsync(x => x.Id == incoming.Id);

        if (existing == null)
        {
            // --- ADD NEW ---
            _context.Onomatopoeias.Add(incoming);
            await _context.SaveChangesAsync();
            return incoming;
        }
        else
        {
            // --- MANUAL SYNC / UPDATE ---
            // Update Parent Fields
            _context.Entry(existing).CurrentValues.SetValues(incoming);

            // Sync Examples (Children)
            // We clear existing ones and add the incoming ones 
            // This prevents "Ghost" records if a user removes an example in the UI
            existing.Examples.Clear();
            existing.Examples.AddRange(incoming.Examples);

            await _context.SaveChangesAsync();
            return existing;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _context.Onomatopoeias.FindAsync(id);
        if (entity == null) return false;

        _context.Onomatopoeias.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}