namespace Autofix.Api.Models;

/// <summary>
/// Error payload inside <see cref="ApiResult{T}"/>: human message, optional code, validation map, and optional diagnostic details.
/// </summary>
public record ApiError
{
    /// <summary>End-user or developer-facing message.</summary>
    public string Message { get; init; }
    /// <summary>Stable error identifier (e.g. from <see cref="Autofix.Domain.Constants.ErrorCodes"/>).</summary>
    public string? Code { get; init; }
    /// <summary>Per-field validation messages when <see cref="Code"/> indicates validation failure.</summary>
    public IDictionary<string, string[]>? ValidationErrors { get; init; }
    /// <summary>Extra structured data (e.g. dev-only exception info).</summary>
    public object? Details { get; init; }

    /// <summary>Creates an error with optional validation map and details.</summary>
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

    /// <summary>Message with optional code; no validation map.</summary>
    public static ApiError Simple(string message, string? code = null)
        => new(message, code);

    /// <summary>FluentValidation-style aggregated errors keyed by property name.</summary>
    public static ApiError Validation(string message, IDictionary<string, string[]> validationErrors)
        => new(message, "VALIDATION_ERROR", validationErrors);

    /// <summary>Error with arbitrary <paramref name="details"/> object (e.g. debug payload).</summary>
    public static ApiError WithDetails(string message, string code, object details)
        => new(message, code, null, details);
}