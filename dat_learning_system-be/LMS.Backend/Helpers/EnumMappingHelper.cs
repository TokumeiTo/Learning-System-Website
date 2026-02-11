using LMS.Backend.Common;

namespace LMS.Backend.Helpers;
public static class EnumMappingHelper
{
    public static Position MapPosition(string? positionName, Position fallback)
    {
        if (string.IsNullOrWhiteSpace(positionName)) return fallback;

        // Try numeric parse first (in case FE sends the ID)
        if (int.TryParse(positionName, out int posInt))
        {
            return Enum.IsDefined(typeof(Position), posInt) ? (Position)posInt : fallback;
        }

        // Map display names to Enum names
        return positionName.Trim() switch
        {
            "Super Admin"     => Position.SuperAdmin,
            "Division Head"  => Position.DivHead,
            "Dept Head"      => Position.DepHead,
            "Section Head"   => Position.SecHead,
            "Project Manager"=> Position.ProjectManager,
            "Employee"       => Position.Employee,
            "Admin"          => Position.Admin,
            "Auditor"        => Position.Auditor,
            _                => fallback
        };
    }
}