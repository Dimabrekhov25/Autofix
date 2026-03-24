namespace Autofix.Api.Models;

public record ApiError
{
    public string Message { get; init; }
    public string? Code { get; init; }
    public IDictionary<string, string[]>? ValidationErrors { get; init; }
    public object? Details { get; init; }

    public ApiError(
        string message, 
        string? code = null, 
        IDictionary<string, string[]>? validationErrors = null, 
        object? details = null)
    {
        Message = message;
        Code = code;
        ValidationErrors = validationErrors;
        Details = details;
    }

    public static ApiError Simple(string message, string? code = null)
        => new(message, code);

    public static ApiError Validation(string message, IDictionary<string, string[]> validationErrors)
        => new(message, "VALIDATION_ERROR", validationErrors);

    public static ApiError WithDetails(string message, string code, object details)
        => new(message, code, null, details);
}