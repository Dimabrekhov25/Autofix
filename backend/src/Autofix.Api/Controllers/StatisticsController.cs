using Autofix.Api.Controllers;
using Autofix.Application.Statistics.Dtos;
using Autofix.Application.Statistics.Queries.GetComprehensiveStatistics;
using Autofix.Application.Statistics.Queries.GetOrderStatistics;
using Autofix.Application.Statistics.Queries.GetPartStatistics;
using Autofix.Application.Statistics.Queries.GetRevenueStatistics;
using Autofix.Application.Statistics.Queries.GetServiceStatistics;
using Autofix.Application.Statistics.Queries.GetVehicleStatistics;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

[Authorize]
public class StatisticsController(IMediator mediator) : BaseController
{
    /// <summary>
    /// Get order statistics for a date range
    /// </summary>
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrderStatistics(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetOrderStatisticsQuery(startDate, endDate);
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Get revenue statistics for a date range with monthly breakdown
    /// </summary>
    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenueStatistics(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetRevenueStatisticsQuery(startDate, endDate);
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Get vehicle statistics
    /// </summary>
    [HttpGet("vehicles")]
    public async Task<IActionResult> GetVehicleStatistics(CancellationToken cancellationToken = default)
    {
        var query = new GetVehicleStatisticsQuery();
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Get top services by usage
    /// </summary>
    [HttpGet("services")]
    public async Task<IActionResult> GetServiceStatistics(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int? topCount = 10,
        CancellationToken cancellationToken = default)
    {
        var query = new GetServiceStatisticsQuery(startDate, endDate, topCount);
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Get top parts by usage
    /// </summary>
    [HttpGet("parts")]
    public async Task<IActionResult> GetPartStatistics(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int? topCount = 10,
        CancellationToken cancellationToken = default)
    {
        var query = new GetPartStatisticsQuery(startDate, endDate, topCount);
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Get comprehensive statistics dashboard
    /// </summary>
    [HttpGet("comprehensive")]
    public async Task<IActionResult> GetComprehensiveStatistics(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetComprehensiveStatisticsQuery(startDate, endDate);
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }
}
