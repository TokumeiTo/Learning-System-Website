using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class DictionaryController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public DictionaryController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string keyword)
    {
        if (string.IsNullOrEmpty(keyword))
            return BadRequest("Keyword is required");

        var client = _httpClientFactory.CreateClient();
        
        // This is the proxy part: your C# server calls Jisho
        var url = $"https://jisho.org/api/v1/search/words?keyword={System.Net.WebUtility.UrlEncode(keyword)}";
        
        var response = await client.GetAsync(url);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            // We return the raw JSON string from Jisho back to your React app
            return Content(content, "application/json");
        }

        return StatusCode((int)response.StatusCode, "Error fetching from Jisho");
    }
}