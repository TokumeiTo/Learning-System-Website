namespace LMS.Backend.Data.Models;
public class PaginatedListDto<T>
{
    public IEnumerable<T> Items { get; set; } = new List<T>();
    public int TotalCount { get; set; }
}