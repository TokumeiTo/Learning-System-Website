// Services/Implementations/GrammarService.cs
using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Flashcard;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

public class GrammarFlashcardService : IGrammarFlashcardService
{
    private readonly IGrammarFlashcardRepository _repo;
    private readonly IMapper _mapper;

    public GrammarFlashcardService(IGrammarFlashcardRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<GrammarDto>> GetAllByLevelAsync(string level)
    {
        var entities = await _repo.GetAllByLevelAsync(level);
        return _mapper.Map<IEnumerable<GrammarDto>>(entities);
    }

    public async Task<GrammarDto?> GetByIdAsync(Guid id)
    {
        var entity = await _repo.GetByIdWithExamplesAsync(id);
        return _mapper.Map<GrammarDto>(entity);
    }

    public async Task CreateGrammarAsync(GrammarCreateUpdateDto dto)
    {
        // 1. Map basic fields (Ignore Examples in Profile)
        var entity = _mapper.Map<Grammar>(dto);

        // 2. Handle child examples manually to ensure IDs are assigned correctly
        foreach (var exDto in dto.Examples)
        {
            var example = _mapper.Map<GrammarExample>(exDto);
            entity.Examples.Add(example);
        }

        await _repo.AddAsync(entity.Id, entity);
        await _repo.SaveChangesAsync();
    }

    public async Task UpdateGrammarAsync(Guid id, GrammarCreateUpdateDto dto)
    {
        // 1. Fetch from Repo WITH Examples included
        var existingGrammar = await _repo.GetByIdWithExamplesAsync(id);
        if (existingGrammar == null) throw new KeyNotFoundException("Grammar point not found");

        // 2. Map basic fields (Title, Meaning, etc.) 
        // Our Mapping Profile .Ignore() ensures existingGrammar.Examples is untouched here
        _mapper.Map(dto, existingGrammar);

        // 3. MANUAL SYNC: Handle the Examples list
        // A) Identify examples to Remove (In DB but not in the incoming DTO)
        var examplesToRemove = existingGrammar.Examples
            .Where(dbEx => !dto.Examples.Any(dtoEx => dtoEx.Id == dbEx.Id))
            .ToList();

        foreach (var ex in examplesToRemove)
        {
            existingGrammar.Examples.Remove(ex);
        }

        // B) Identify Add/Update
        foreach (var dtoEx in dto.Examples)
        {
            var existingEx = existingGrammar.Examples
                .FirstOrDefault(dbEx => dbEx.Id == dtoEx.Id);

            if (existingEx != null)
            {
                // UPDATE: Match found, copy text fields over
                _mapper.Map(dtoEx, existingEx);
            }
            else
            {
                // ADD: No ID or non-matching ID, create new record
                var newEx = _mapper.Map<GrammarExample>(dtoEx);
                existingGrammar.Examples.Add(newEx);
            }
        }

        // 4. Save changes via Repository
        await _repo.UpdateAsync(existingGrammar);
        await _repo.SaveChangesAsync();
    }

    public async Task DeleteGrammarAsync(Guid id)
    {
        await _repo.DeleteAsync(id);
        await _repo.SaveChangesAsync();
    }
}