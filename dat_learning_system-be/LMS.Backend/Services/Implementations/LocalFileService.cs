using LMS.Backend.Services.Interfaces;

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

        // Path: wwwroot/uploads/thumbnails
        string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", folderName);
        if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

        // Unique Name: guid_filename.jpg
        string fileName = $"{Guid.NewGuid()}_{file.FileName}";
        string filePath = Path.Combine(uploadsFolder, fileName);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        // Return the URL for the frontend
        return $"/uploads/{folderName}/{fileName}";
    }
}