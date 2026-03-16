namespace LMS.Backend.Services.Interfaces;

public interface IMediaHandlerService
{
    Task<string> HandleBase64MediaAsync(string body, string contentType);
}