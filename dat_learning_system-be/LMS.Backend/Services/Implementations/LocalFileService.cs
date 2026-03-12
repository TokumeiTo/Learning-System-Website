using LMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.StaticFiles;

namespace LMS.Backend.Services.Implement;

public class LocalFileService : IFileService
{
    private readonly IWebHostEnvironment _env;

    public LocalFileService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string> UploadFileAsync(IFormFile file, string folderName)
    {
        if (file == null || file.Length == 0) return string.Empty;

        string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", folderName);
        if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

        // Get file name and extension separately
        string originalFileName = Path.GetFileNameWithoutExtension(file.FileName);
        string extension = Path.GetExtension(file.FileName);
        string fileName = file.FileName;
        string filePath = Path.Combine(uploadsFolder, fileName);

        // Logic for (1), (2), (3)...
        int count = 1;
        while (File.Exists(filePath))
        {
            fileName = $"{originalFileName}({count}){extension}";
            filePath = Path.Combine(uploadsFolder, fileName);
            count++;
        }

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        return $"/uploads/{folderName}/{fileName}";
    }

    public void DeleteFile(string fileUrl)
    {
        if (string.IsNullOrEmpty(fileUrl)) return;

        // Convert URL (/uploads/images/file.jpg) back to physical path
        var relativePath = fileUrl.TrimStart('/');
        var fullPath = Path.Combine(_env.WebRootPath, relativePath);

        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
    }

    public async Task<(Stream stream, string contentType, string fileName)> GetFileStreamForDownloadAsync(string fileUrl)
    {
        if (string.IsNullOrEmpty(fileUrl)) throw new FileNotFoundException();

        var relativePath = fileUrl.TrimStart('/');
        var fullPath = Path.Combine(_env.WebRootPath, relativePath);

        if (!File.Exists(fullPath)) throw new FileNotFoundException();

        // Use FileStream for memory efficiency
        var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, useAsync: true);

        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(fullPath, out var contentType))
        {
            contentType = "application/octet-stream";
        }

        return (stream, contentType, Path.GetFileName(fullPath));
    }


}