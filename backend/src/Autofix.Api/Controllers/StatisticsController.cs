using Autofix.Api.Models;
using Autofix.Application.Statistics.Queries.GetComprehensiveStatistics;
using Autofix.Application.Common.Security;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

[Authorize(Policy = PolicyNames.AdminUser)]
public sealed class StatisticsController(IMediator mediator) : BaseController
{
    [HttpGet("comprehensive")]
    public async Task<IActionResult> GetComprehensiveStatistics(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetComprehensiveStatisticsQuery(), cancellationToken);
        return OkResult(result);
    }
}
