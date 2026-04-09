using Autofix.Api.Models;
using Autofix.Application.Common.Security;
using Autofix.Application.ServiceOrders.Commands.AddManualServiceOrderPart;
using Autofix.Application.ServiceOrders.Commands.AddServiceOrderCatalogItems;
using Autofix.Application.ServiceOrders.Commands.MarkCustomerApprovalNotificationRead;
using Autofix.Application.ServiceOrders.Commands.RemoveServiceOrderPartItem;
using Autofix.Application.ServiceOrders.Commands.RemoveServiceOrderWorkItem;
using Autofix.Application.ServiceOrders.Commands.UpdateServiceOrderStatus;
using Autofix.Application.ServiceOrders.Commands.UpdateServiceOrderWorkItem;
using Autofix.Application.ServiceOrders.Queries.GetCustomerApprovalNotifications;
using Autofix.Application.ServiceOrders.Queries.GetServiceOrderByBookingId;
using Autofix.Application.ServiceOrders.Queries.GetServiceOrderById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

[Authorize(Policy = PolicyNames.AdminOnly)]
public sealed class ServiceOrdersController(IMediator mediator) : BaseController
{
    [HttpGet("customer-approval-notifications")]
    public async Task<IActionResult> GetCustomerApprovalNotifications(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetCustomerApprovalNotificationsQuery(), cancellationToken);
        return OkResult(result);
    }

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

    [HttpPost("{id:guid}/customer-approval-notifications/read")]
    public async Task<IActionResult> MarkCustomerApprovalNotificationRead(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new MarkCustomerApprovalNotificationReadCommand(id), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Customer approval notification for service order {id} not found"));
        }

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

    [HttpDelete("{id:guid}/work-items/{workItemId:guid}")]
    public async Task<IActionResult> RemoveWorkItem(
        Guid id,
        Guid workItemId,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new RemoveServiceOrderWorkItemCommand(id, workItemId), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Work item {workItemId} not found"));
        }

        return OkResult(result);
    }

    [HttpPut("{id:guid}/work-items/{workItemId:guid}")]
    public async Task<IActionResult> UpdateWorkItem(
        Guid id,
        Guid workItemId,
        [FromBody] UpdateServiceOrderWorkItemCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id || workItemId != command.WorkItemId)
        {
            return BadRequestResult("Route ids do not match body ids.");
        }

        var result = await mediator.Send(command, cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Work item {workItemId} not found"));
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
