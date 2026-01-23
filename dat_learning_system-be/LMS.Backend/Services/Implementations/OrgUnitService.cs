using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.OrgUnit;
using LMS.Backend.Repo.Interface;
using LMS.Backend.Services.Interfaces;

namespace LMS.Backend.Services.Implement;

public class OrgUnitService : IOrgUnitService
{
    private readonly IOrgUnitRepository _unitRepo;
    private readonly IMapper _mapper;

    public OrgUnitService(IOrgUnitRepository unitRepo, IMapper mapper)
    {
        _unitRepo = unitRepo;
        _mapper = mapper;
    }
    public async Task<bool> CreateUnitAsync(OrgUnitRequestDto dto)
    {
        if (dto.ParentId.HasValue)
        {
            var parent = await _unitRepo.GetByIdAsync(dto.ParentId.Value);
            if (parent == null) return false;
        }

        var unit = _mapper.Map<OrgUnit>(dto);
        return await _unitRepo.AddAsync(unit);
    }
    public async Task<IEnumerable<OrgUnitResponseDto>> GetHierarchyAsync()
    {
        var units = await _unitRepo.GetAllAsync();

        var rootUnits = units.Where(u => u.ParentId == null);

        return _mapper.Map<IEnumerable<OrgUnitResponseDto>>(rootUnits);
    }

    public async Task<IEnumerable<OrgUnitSelectDto>> GetAllTeams()
    {
        var units = await _unitRepo.GetAllTeams();
        return _mapper.Map<IEnumerable<OrgUnitSelectDto>>(units);
    }

    public async Task<IEnumerable<OrgUnitSelectDto>> GetAllDivisions()
    {
        var units = await _unitRepo.GetAllDivisions();
        return _mapper.Map<IEnumerable<OrgUnitSelectDto>>(units);
    }

    public async Task<IEnumerable<OrgUnitSelectDto>> GetAllDepartments()
    {
        var units = await _unitRepo.GetAllDepartments();
        return _mapper.Map<IEnumerable<OrgUnitSelectDto>>(units);
    }

    public async Task<IEnumerable<OrgUnitSelectDto>> GetAllSections()
    {
        var units = await _unitRepo.GetAllSections();
        return _mapper.Map<IEnumerable<OrgUnitSelectDto>>(units);
    }

}