using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace LMS.Backend.Services.Implement;

public class MediaHandlerService : IMediaHandlerService
{
    private readonly IFileService _fileService;

    public MediaHandlerService(IFileService fileService)
    {
        _fileService = fileService;
    }

    public async Task<string> HandleBase64MediaAsync(string body, string contentType)
    {
        if (string.IsNullOrEmpty(body) || body.StartsWith("/uploads/")) return body;

        try
        {
            string base64Data;
            string fileName;

            if (body.Trim().StartsWith("{"))
            {
                var mediaData = JsonSerializer.Deserialize<MediaUploadJson>(body, new JsonSerializerOptions 
                { 
                    PropertyNameCaseInsensitive = true 
                });
                base64Data = mediaData?.Data ?? string.Empty;
                fileName = mediaData?.Name ?? "upload";
            }
            else
            {
                base64Data = body;
                fileName = $"upload_{Guid.NewGuid()}";
            }

            if (!base64Data.StartsWith("data:")) return body;

            var parts = base64Data.Split(',');
            if (parts.Length < 2) return body;

            string metadata = parts[0];
            string base64Content = parts[1];
            byte[] bytes = Convert.FromBase64String(base64Content);

            string mimeType = metadata.Split(':')[1].Split(';')[0];
            string extension = GetExtensionFromMimeType(mimeType);

            if (!Path.HasExtension(fileName)) fileName = $"{fileName}.{extension}";

            string folderName = contentType switch
            {
                "image" => "images",
                "video" => "videos",
                "file" => "documents",
                _ => "others"
            };

            using var stream = new MemoryStream(bytes);
            var formFile = new FormFile(stream, 0, bytes.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = mimeType
            };

            return await _fileService.UploadFileAsync(formFile, folderName);
        }
        catch { return body; }
    }

    private string GetExtensionFromMimeType(string mimeType) => mimeType switch
    {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" => "xlsx",
        "application/vnd.ms-excel" => "xls",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" => "docx",
        "application/msword" => "doc",
        "application/pdf" => "pdf",
        "text/csv" => "csv",
        _ => mimeType.Contains("/") ? mimeType.Split('/')[1] : "bin"
    };

    private class MediaUploadJson
    {
        public string Data { get; set; } = string.Empty;
        public string? Name { get; set; }
    }
}