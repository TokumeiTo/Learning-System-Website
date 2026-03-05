using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Flashcard;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement
{
    public class KanjiFlashcardService : IKanjiFlashcardService
    {
        private readonly IKanjiFlashcardRepository _repo;
        private readonly IMapper _mapper;

        public KanjiFlashcardService(IKanjiFlashcardRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<KanjiDto>> GetAllKanjisAsync(string? level = null)
        {
            var kanjis = await _repo.GetAllAsync(level);
            return _mapper.Map<IEnumerable<KanjiDto>>(kanjis);
        }

        public async Task<KanjiDto?> GetKanjiByIdAsync(Guid id)
        {
            var kanji = await _repo.GetByIdAsync(id);
            return _mapper.Map<KanjiDto>(kanji);
        }

        public async Task<KanjiDto> CreateKanjiAsync(KanjiCreateUpdateDto dto)
        {
            // Map basic properties
            var kanji = _mapper.Map<Kanji>(dto);
            
            // Manually handle the initial child list creation
            kanji.Examples = dto.Examples.Select(e => _mapper.Map<KanjiExample>(e)).ToList();

            await _repo.AddAsync(kanji);
            await _repo.SaveChangesAsync();

            return _mapper.Map<KanjiDto>(kanji);
        }

        public async Task<bool> UpdateKanjiAsync(Guid id, KanjiCreateUpdateDto dto)
        {
            var existingKanji = await _repo.GetByIdAsync(id);
            if (existingKanji == null) return false;

            // 1. Manual Sync Scalar Properties (Safe overwrite)
            existingKanji.Character = dto.Character;
            existingKanji.Meaning = dto.Meaning;
            existingKanji.Romaji = dto.Romaji;
            existingKanji.Strokes = dto.Strokes;
            existingKanji.JlptLevel = dto.JlptLevel;
            existingKanji.Onyomi = string.Join(";", dto.Onyomi);
            existingKanji.Kunyomi = string.Join(";", dto.Kunyomi);

            // 2. Manual Child Collection Reconciliation
            // Remove
            var incomingIds = dto.Examples.Select(e => e.Id).ToList();
            var toRemove = existingKanji.Examples.Where(e => !incomingIds.Contains(e.Id)).ToList();
            foreach (var ex in toRemove) existingKanji.Examples.Remove(ex);

            // Add or Update
            foreach (var exDto in dto.Examples)
            {
                var existingEx = existingKanji.Examples.FirstOrDefault(e => e.Id == exDto.Id);

                if (existingEx == null)
                {
                    // Map new child from DTO
                    var newEx = _mapper.Map<KanjiExample>(exDto);
                    newEx.KanjiId = id;
                    existingKanji.Examples.Add(newEx);
                }
                else
                {
                    // Manual sync child properties
                    existingEx.Word = exDto.Word;
                    existingEx.Reading = exDto.Reading;
                    existingEx.Meaning = exDto.Meaning;
                }
            }

            _repo.Update(existingKanji);
            return await _repo.SaveChangesAsync();
        }

        public async Task<bool> DeleteKanjiAsync(Guid id)
        {
            var kanji = await _repo.GetByIdAsync(id);
            if (kanji == null) return false;

            _repo.Delete(kanji);
            return await _repo.SaveChangesAsync();
        }
    }
}