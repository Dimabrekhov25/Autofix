using Asp.Versioning;
using Autofix.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

/// <summary>
/// Shared REST conventions for Autofix API controllers: URL versioning, route template, and <see cref="ApiResult{T}"/>-wrapped JSON.
/// </summary>
[ApiController]
[ApiVersion(1.0)]
[Route("api/v{version:apiVersion}/[controller]")]
public abstract class BaseController : ControllerBase
{
    /// <summary>
    /// Returns HTTP 200 with a successful <see cref="ApiResult{T}"/> envelope around <paramref name="data"/>.
    /// </summary>
    protected IActionResult OkResult<T>(T data)
    {
        return Ok(ApiResult.Success(data));
    }

    /// <summary>
    /// Returns HTTP 201 Created with a successful <see cref="ApiResult{T}"/> envelope around <paramref name="data"/>.
    /// </summary>
    protected IActionResult CreatedResult<T>(T data)
    {
        return StatusCode(StatusCodes.Status201Created, ApiResult.Success(data));
    }

    /// <summary>
    /// Returns HTTP 400 Bad Request with a failure <see cref="ApiResult{T}"/> using <paramref name="message"/>.
    /// </summary>
    protected IActionResult BadRequestResult(string message)
    {
        return BadRequest(ApiResult.Failure(message));
    }
}
