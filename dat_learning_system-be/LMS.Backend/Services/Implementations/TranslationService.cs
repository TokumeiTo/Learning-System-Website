using LMS.Backend.DTOs.Translation;
using LMS.Backend.Services.Interfaces;
using System.Net;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using Kawazu;
using LMS.Backend.Data.Models;

namespace LMS.Backend.Services.Implement;

public class TranslationService : ITranslationService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;
    ILogger<TranslationService> _logger;

    private static readonly string _dicPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "IpaDic");
    private static readonly KawazuConverter _kawazu = new KawazuConverter(_dicPath);

    public TranslationService(IHttpClientFactory httpClientFactory, IConfiguration config, ILogger<TranslationService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _config = config;
        _logger = logger;
    }

    public async Task<TranslationResponseDto> TranslateAsync(TranslationRequestDto dto)
    {
        var client = _httpClientFactory.CreateClient();

        // 1. Resolve languages and context
        string sourceLang = ResolveLanguage(dto.SourceLanguage, dto.Text);
        string contentToTranslate = dto.IsItContext
            ? $"[Technical IT Context]: {dto.Text}"
            : dto.Text;

        // 2. Build URL with optional Email for higher rate limits
        var baseUrl = _config["Translation:ApiUrl"] ?? "https://api.mymemory.translated.net/get";
        var contactEmail = _config["Translation:ContactEmail"];

        var url = $"{baseUrl}?q={WebUtility.UrlEncode(contentToTranslate)}&langpair={sourceLang}|{dto.TargetLanguage}";

        if (!string.IsNullOrEmpty(contactEmail))
        {
            url += $"&de={WebUtility.UrlEncode(contactEmail)}";
        }

        // 3. Execute Request
        // EnsureSuccessStatusCode throws an exception caught by ExceptionMiddleware if the API is down
        var response = await client.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<MyMemoryResponse>();
        string translatedText = result?.ResponseData?.TranslatedText ?? "Translation failed.";

        // 4. Handle Romaji with local fallback
        string romaji = string.Empty;
        bool isJapaneseTarget = dto.TargetLanguage.ToLower() is "ja" or "jp";

        if (isJapaneseTarget && !string.IsNullOrEmpty(translatedText))
        {
            try
            {
                romaji = await _kawazu.Convert(translatedText, To.Romaji, Mode.Spaced);
            }
            catch (Exception ex)
            {
                // We log the warning to your new .txt files, but return the translation anyway
                _logger.LogWarning(ex, "Romaji conversion failed for: {Text}", translatedText);
                romaji = string.Empty;
            }
        }

        return new TranslationResponseDto
        {
            TranslatedText = translatedText,
            Romaji = romaji
        };
    }

    /// <summary>
    /// Detects if the text is Myanmar, Japanese, or English if "auto" is selected.
    /// </summary>
    private string ResolveLanguage(string langCode, string text)
    {
        if (langCode.ToLower() != "auto") return langCode.ToLower();
        string cleanText = text.Replace("[Technical IT Context]:", "").Trim();

        // Check for Myanmar Script (Unicode Range U+1000–U+109F)
        if (Regex.IsMatch(cleanText, @"[\u1000-\u109F]")) return "my";

        // Check for Japanese Script (Hiragana/Katakana/Kanji)
        if (Regex.IsMatch(cleanText, @"[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]")) return "ja";

        // Default to English
        return "en";
    }
}