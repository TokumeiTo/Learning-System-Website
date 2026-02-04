using LMS.Backend.DTOs.Translation;
using LMS.Backend.Services.Interfaces;
using System.Net;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions; // Added for script detection
using Kawazu;
using LMS.Backend.Data.Models;

namespace LMS.Backend.Services.Implement;

public class TranslationService : ITranslationService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;

    private static readonly string _dicPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "IpaDic");
    private static readonly KawazuConverter _kawazu = new KawazuConverter(_dicPath);

    public TranslationService(IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _httpClientFactory = httpClientFactory;
        _config = config;
    }

    public async Task<TranslationResponseDto> TranslateAsync(TranslationRequestDto dto)
    {
        var client = _httpClientFactory.CreateClient();

        // 1. Resolve Source Language (Handle "auto" for Myanmar/Japanese/English)
        string sourceLang = ResolveLanguage(dto.SourceLanguage, dto.Text);

        string contentToTranslate = dto.IsItContext
            ? $"[Technical IT Context]: {dto.Text}"
            : dto.Text;

        var baseUrl = _config["Translation:ApiUrl"] ?? "https://api.mymemory.translated.net/get";
        var encodedText = WebUtility.UrlEncode(contentToTranslate);

        // langPair is now guaranteed to be valid ISO codes like "my|en" or "ja|en"
        var langPair = $"{sourceLang}|{dto.TargetLanguage}";
        var url = $"{baseUrl}?q={encodedText}&langpair={langPair}";

        var response = await client.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Translation API returned {response.StatusCode}");
        }

        var result = await response.Content.ReadFromJsonAsync<MyMemoryResponse>();
        string translatedText = result?.ResponseData?.TranslatedText ?? "Translation failed.";

        // 2. Japanese Romaji Logic
        string romaji = string.Empty;
        bool isJapanese = dto.TargetLanguage.ToLower() is "ja" or "jp";

        if (isJapanese && !string.IsNullOrEmpty(translatedText))
        {
            try
            {
                romaji = await _kawazu.Convert(translatedText, To.Romaji, Mode.Spaced);
            }
            catch { romaji = string.Empty; }
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
        if (Regex.IsMatch(text, @"[\u1000-\u109F]")) return "my";

        // Check for Japanese Script (Hiragana/Katakana/Kanji)
        if (Regex.IsMatch(text, @"[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]")) return "ja";

        // Default to English
        return "en";
    }
}