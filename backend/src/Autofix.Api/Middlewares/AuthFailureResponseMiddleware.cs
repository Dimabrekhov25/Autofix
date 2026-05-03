using Autofix.Api.Models;
using Autofix.Domain.Constants;

namespace Autofix.Api.Middlewares;

/// <summary>
/// When auth middleware returns 401/403 with an empty body, writes a consistent <see cref="ApiResult{T}"/> JSON error for API clients.
/// </summary>
public sealed class AuthFailureResponseMiddleware(RequestDelegate next)
{
    /// <summary>Runs the rest of the pipeline, then fills in JSON for anonymous/forbidden responses if needed.</summary>
    public async Task InvokeAsync(HttpContext context)
    {
        await next(context);

        if (context.Response.HasStarted)
        {
            return;
        }

        if (context.Response.StatusCode != StatusCodes.Status401Unauthorized &&
            context.Response.StatusCode != StatusCodes.Status403Forbidden)
        {
            return;
        }

        if (context.Response.ContentLength is > 0 || !string.IsNullOrWhiteSpace(context.Response.ContentType))
        {
            return;
        }

        context.Response.ContentType = "application/json";

        if (context.Response.StatusCode == StatusCodes.Status401Unauthorized)
        {
            await context.Response.WriteAsJsonAsync(
                ApiResult.Failure(ApiError.Simple(
                    "Authentication is required to access this resource.",
                    ErrorCodes.Unauthorized)));

            return;
        }

        await context.Response.WriteAsJsonAsync(
            ApiResult.Failure(ApiError.Simple(
                "You do not have permission to perform this action.",
                ErrorCodes.Forbidden)));
    }
}
