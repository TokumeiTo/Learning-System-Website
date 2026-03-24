namespace LMS.Backend.Helpers;

public static class RoadmapResourceHelper
{
    public static (string Type, string RawId) ParseResourceId(string? linkedId)
    {
        if (string.IsNullOrWhiteSpace(linkedId) || !linkedId.Contains(" - "))
            return ("None", string.Empty);

        var parts = linkedId.Split(" - ");
        return (parts[0], parts[1]);
    }
}