using LMS.Backend.Data;

namespace LMS.Backend.Repo.Interface;

public interface IVocabularyRepository
{
    Task<IEnumerable<Vocabulary>> GetAllByLevelAsync(string level);
    Task<Vocabulary?> GetByIdAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task AddAsync(Vocabulary vocabulary);
    void Update(Vocabulary vocabulary);
    void Delete(Vocabulary vocabulary);
    Task<bool> SaveChangesAsync();
}