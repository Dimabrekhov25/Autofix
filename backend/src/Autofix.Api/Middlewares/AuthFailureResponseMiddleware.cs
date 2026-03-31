using Autofix.Api.Models;
using Autofix.Domain.Constants;

namespace Autofix.Api.Middlewares;

public sealed class AuthFailureResponseMiddleware(RequestDelegate next)
{
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
