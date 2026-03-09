
using AutoMapper;
using LMS.Backend.Data;
using LMS.Backend.DTOs.Flashcard;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class VocabularyService : IVocabularyService
{
    private readonly IVocabularyRepository _repo;
    private readonly IMapper _mapper;

    public VocabularyService(IVocabularyRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<VocabResponseDto>> GetLevelListAsync(string level)
    {
        var list = await _repo.GetAllByLevelAsync(level);
        return _mapper.Map<IEnumerable<VocabResponseDto>>(list);
    }

    public async Task<VocabResponseDto?> GetDetailAsync(Guid id)
    {
        var vocab = await _repo.GetByIdAsync(id);
        return vocab == null ? null : _mapper.Map<VocabResponseDto>(vocab);
    }

    public async Task<VocabResponseDto> UpsertAsync(VocabUpsertRequestDto dto)
    {
        Vocabulary? vocab;

        // Check if this is an Update (ID exists) or a Create
        if (dto.Id.HasValue && dto.Id != Guid.Empty)
        {
            // 1. Fetch current entity with Examples
            vocab = await _repo.GetByIdAsync(dto.Id.Value);
            
            if (vocab == null) throw new KeyNotFoundException("Vocabulary word not found");

            // 2. Manual Sync: Update the core properties
            _mapper.Map(dto, vocab);

            // 3. Safe Example Sync: 
            // We clear and re-add to ensure the list exactly matches the UI's state.
            vocab.Examples.Clear();
            vocab.Examples.AddRange(_mapper.Map<List<VocabularyExample>>(dto.Examples));

            _repo.Update(vocab);
        }
        else
        {
            // CREATE Scenario
            vocab = _mapper.Map<Vocabulary>(dto);
            await _repo.AddAsync(vocab);
        }

        await _repo.SaveChangesAsync();
        return _mapper.Map<VocabResponseDto>(vocab);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var vocab = await _repo.GetByIdAsync(id);
        if (vocab == null) return false;

        _repo.Delete(vocab);
        return await _repo.SaveChangesAsync();
    }
}