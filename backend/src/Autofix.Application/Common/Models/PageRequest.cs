namespace Autofix.Application.Common.Models;

/// <summary>
/// Represents pagination parameters with validation and normalization.
/// </summary>
public sealed record PageRequest
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;

    private int _page = DefaultPage;
    private int _pageSize = DefaultPageSize;

    /// <summary>
    /// Current page number (minimum: 1).
    /// </summary>
    public int Page
    {
        get => _page;
        init => _page = value < 1 ? DefaultPage : value;
    }

    /// <summary>
    /// Number of items per page (minimum: 1, maximum: 100).
    /// </summary>
    public int PageSize
    {
        get => _pageSize;
        init => _pageSize = value < 1 ? DefaultPageSize : Math.Min(value, MaxPageSize);
    }

    /// <summary>
    /// Calculate skip count for database queries.
    /// </summary>
    public int Skip => (Page - 1) * PageSize;

    /// <summary>
    /// Get the take count (same as PageSize).
    /// </summary>
    public int Take => PageSize;

    /// <summary>
    /// Creates a default pagination request (page 1, 20 items).
    /// </summary>
    public static PageRequest Default => new();

    /// <summary>
    /// Creates a pagination request with custom values.
    /// </summary>
    public static PageRequest Create(int page, int pageSize)
        => new() { Page = page, PageSize = pageSize };
}
