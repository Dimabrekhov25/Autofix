namespace Autofix.Api.Models;

/// <summary>
/// Standard API envelope: success flag, optional payload, optional <see cref="ApiError"/>, and UTC timestamp.
/// </summary>
public record ApiResult<T>
{
    /// <summary><c>true</c> when <see cref="Data"/> is authoritative; <c>false</c> when <see cref="Error"/> is set.</summary>
    public bool Status { get; init; }
    /// <summary>Response body on success.</summary>
    public T? Data { get; init; }
    /// <summary>Error details on failure.</summary>
    public ApiError? Error { get; init; }
    /// <summary>When the result object was constructed (UTC).</summary>
    public DateTime CreatedAt { get; init; }

    /// <summary>Creates an instance with the given outcome fields.</summary>
    public ApiResult(bool status, T? data, ApiError? error)
    {
        Status = status;
        Data = data;
        Error = error;
        CreatedAt = DateTime.UtcNow;
    }

    /// <summary>Successful result wrapping <paramref name="data"/>.</summary>
    public static ApiResult<T> Success(T data)
        => new(true, data, null);

    /// <summary>Failed result with structured <paramref name="error"/>.</summary>
    public static ApiResult<T> Failure(ApiError error)
        => new(false, default, error);

    /// <summary>Failed result with a simple message and optional machine-readable <paramref name="code"/>.</summary>
    public static ApiResult<T> Failure(string message, string? code = null)
        => new(false, default, ApiError.Simple(message, code));
}

/// <summary>
/// Factory helpers for untyped <see cref="ApiResult{Object}"/> responses (e.g. empty success body).
/// </summary>
public static class ApiResult
{
    /// <summary>Typed success wrapper.</summary>
    public static ApiResult<T> Success<T>(T data)
        => ApiResult<T>.Success(data);

    /// <summary>Success with an empty anonymous payload.</summary>
    public static ApiResult<object> Success()
        => new(true, new { }, null);

    /// <summary>Failure with <see cref="ApiError"/>.</summary>
    public static ApiResult<object> Failure(ApiError error)
        => new(false, null, error);

    /// <summary>Failure with message and optional code.</summary>
    public static ApiResult<object> Failure(string message, string? code = null)
        => new(false, null, ApiError.Simple(message, code));
}
