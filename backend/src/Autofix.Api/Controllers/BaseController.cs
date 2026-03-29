using Asp.Versioning;
using Autofix.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

[ApiController]
[ApiVersion(1.0)]
[Route("api/v{version:apiVersion}/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected IActionResult OkResult<T>(T data)
    {
        return Ok(ApiResult.Success(data));
    }

    protected IActionResult BadRequestResult(string massege)
    {
        return BadRequest(ApiResult.Failure(massege));
    }
}