namespace LMS.Backend.Services.Interfaces;
public interface IFileService
{
    // Returns the relative URL/Path of the saved file
    Task<string> UploadFileAsync(IFormFile file, string folderName);
    void DeleteFile(string fileUrl);
    Task<(Stream stream, string contentType, string fileName)> GetFileStreamForDownloadAsync(string fileUrl);
    Task<string> UploadAndOptimizePdf(IFormFile file);
}