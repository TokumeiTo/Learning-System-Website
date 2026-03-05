using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface IKanjiFlashcardRepository
{
    Task<IEnumerable<Kanji>> GetAllAsync(string? level = null);
    Task<Kanji?> GetByIdAsync(Guid id);
    Task AddAsync(Kanji kanji);
    void Update(Kanji kanji); // Tracking happens in DBContext
    void Delete(Kanji kanji);
    Task<bool> SaveChangesAsync();
    Task<bool> ExistsAsync(Guid id);
}