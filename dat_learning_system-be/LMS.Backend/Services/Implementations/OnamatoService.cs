using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Flashcard;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class OnomatoService : IOnomatoService
{
    private readonly IOnomatoRepository _repo;
    private readonly IMapper _mapper;

    public OnomatoService(IOnomatoRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<OnomatoResponseDto>> GetAllAsync()
    {
        var entities = await _repo.GetAllAsync();
        return _mapper.Map<IEnumerable<OnomatoResponseDto>>(entities);
    }

    public async Task<OnomatoResponseDto?> GetByIdAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id);
        return entity == null ? null : _mapper.Map<OnomatoResponseDto>(entity);
    }

    public async Task<OnomatoResponseDto> UpsertAsync(OnomatoUpsertRequestDto request)
    {
        // 1. Map DTO to Entity for the Repo
        var incomingEntity = _mapper.Map<Onomatopoeia>(request);

        // 2. Repo handles the Manual Sync (Check ID -> Update/Clear/Add)
        var result = await _repo.UpsertAsync(incomingEntity);

        // 3. Map back to Response DTO for the Frontend
        return _mapper.Map<OnomatoResponseDto>(result);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repo.DeleteAsync(id);
    }
}