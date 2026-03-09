using LMS.Backend.Data.Entities;

namespace LMS.Backend.Repo.Interface;

public interface IOnomatoRepository
{
    Task<IEnumerable<Onomatopoeia>> GetAllAsync();
    Task<Onomatopoeia?> GetByIdAsync(int id);
    Task<Onomatopoeia> UpsertAsync(Onomatopoeia entity);
    Task<bool> DeleteAsync(int id);
}