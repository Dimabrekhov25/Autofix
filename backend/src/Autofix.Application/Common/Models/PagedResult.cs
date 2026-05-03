namespace Autofix.Application.Common.Models;

/// <summary>
/// Page of items plus paging metadata for list endpoints.
/// </summary>
public sealed record PagedResult<T>(
    IReadOnlyList<T> Items,
    int PageNumber,
    int PageSize,
    int TotalCount
)
{
    /// <summary>
    /// Total pages given <see cref="PageSize"/> and <see cref="TotalCount"/>; zero if page size is invalid.
    /// </summary>
    public int TotalPages => PageSize <= 0 ? 0 : (int)Math.Ceiling(TotalCount / (double)PageSize);
}
