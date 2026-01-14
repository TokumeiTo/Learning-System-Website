using AutoMapper;
using LMS.Backend.Data.Entities;
using LMS.Backend.DTOs.Auth;
using LMS.Backend.DTOs.OrgUnit;
using LMS.Backend.DTOs.User;

namespace LMS.Backend.Helpers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Existing User mapping
        CreateMap<ApplicationUser, UserResponseDto>()
            // Map the Enum to String automatically
            .ForMember(dest => dest.Position, opt => opt.MapFrom(src => src.Position.ToString()))
            // Map the Navigation Property Name
            .ForMember(dest => dest.OrgUnitName, opt => opt.MapFrom(src => src.OrgUnit != null ? src.OrgUnit.Name : null));

        // Registration mapping
        CreateMap<RegisterRequestDto, ApplicationUser>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.CompanyCode))
            .ForMember(dest => dest.MustChangePassword, opt => opt.MapFrom(_ => true));

        // Login response mapping
        CreateMap<ApplicationUser, LoginResponseDto>()
            .ForMember(dest => dest.Position, opt => opt.MapFrom(src => src.Position.ToString()));

        // Orgunit response mapping
        CreateMap<OrgUnitRequestDto, OrgUnit>();
        CreateMap<OrgUnit, OrgUnitResponseDto>();
    }
}