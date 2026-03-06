using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;
public interface IGrammarFlashcardRepository
{
    Task<IEnumerable<Grammar>> GetAllByLevelAsync(string level);
    Task<Grammar?> GetByIdWithExamplesAsync(Guid id);
    Task AddAsync(Guid id, Grammar grammar);
    Task UpdateAsync(Grammar grammar);
    Task DeleteAsync(Guid id);
    Task<bool> SaveChangesAsync();
}