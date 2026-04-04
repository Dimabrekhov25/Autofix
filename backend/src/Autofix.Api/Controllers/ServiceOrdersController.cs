using Autofix.Api.Models;
using Autofix.Application.Common.Security;
using Autofix.Application.ServiceOrders.Commands.AddManualServiceOrderPart;
using Autofix.Application.ServiceOrders.Commands.AddServiceOrderCatalogItems;
using Autofix.Application.ServiceOrders.Commands.RemoveServiceOrderPartItem;
using Autofix.Application.ServiceOrders.Commands.UpdateServiceOrderStatus;
using Autofix.Application.ServiceOrders.Queries.GetServiceOrderByBookingId;
using Autofix.Application.ServiceOrders.Queries.GetServiceOrderById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

[Authorize(Policy = PolicyNames.AdminOnly)]
public sealed class ServiceOrdersController(IMediator mediator) : BaseController
{
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetServiceOrderByIdQuery(id), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Service order {id} not found"));
        }

        return OkResult(result);
    }

    [HttpGet("by-booking/{bookingId:guid}")]
    public async Task<IActionResult> GetByBookingId(Guid bookingId, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetServiceOrderByBookingIdQuery(bookingId), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Service order for booking {bookingId} not found"));
        }

        return OkResult(result);
    }

    [HttpPost("{id:guid}/catalog-items")]
    public async Task<IActionResult> AddCatalogItems(
        Guid id,
        [FromBody] AddServiceOrderCatalogItemsCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequestResult("Route id does not match body id.");
        }

        var result = await mediator.Send(command, cancellationToken);
        return OkResult(result);
    }

    [HttpPost("{id:guid}/parts")]
    public async Task<IActionResult> AddManualPart(
        Guid id,
        [FromBody] AddManualServiceOrderPartCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequestResult("Route id does not match body id.");
        }

        var result = await mediator.Send(command, cancellationToken);
        return OkResult(result);
    }

    [HttpDelete("{id:guid}/parts/{partItemId:guid}")]
    public async Task<IActionResult> RemovePartItem(
        Guid id,
        Guid partItemId,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new RemoveServiceOrderPartItemCommand(id, partItemId), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Part item {partItemId} not found"));
        }

        return OkResult(result);
    }

    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        [FromBody] UpdateServiceOrderStatusCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequestResult("Route id does not match body id.");
        }

        var result = await mediator.Send(command, cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Service order {id} not found"));
        }

        return OkResult(result);
    }
}
