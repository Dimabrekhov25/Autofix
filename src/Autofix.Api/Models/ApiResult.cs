namespace Autofix.Api.Models;

public record ApiResult<T>
{
    public bool Status { get; init; }
    public T? Data { get; init; }
    public ApiError? Error { get; init; }
    public DateTime CreatedAt { get; init; }

    public ApiResult(bool status, T? data, ApiError? error)
    {
        Status = status;
        Data = data;
        Error = error;
        CreatedAt = DateTime.UtcNow;
    }

    public static ApiResult<T> Success(T data)
        => new(true, data, null);

    public static ApiResult<T> Failure(ApiError error)
        => new(false, default, error);

    public static ApiResult<T> Failure(string message, string? code = null)
        => new(false, default, ApiError.Simple(message, code));
}

public static class ApiResult
{
    public static ApiResult<T> Success<T>(T data)
        => ApiResult<T>.Success(data);

    public static ApiResult<object> Success()
        => new(true, new { }, null);

    public static ApiResult<object> Failure(ApiError error)
        => new(false, null, error);

    public static ApiResult<object> Failure(string message, string? code = null)
        => new(false, null, ApiError.Simple(message, code));
}
