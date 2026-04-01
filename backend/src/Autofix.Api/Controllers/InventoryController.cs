using Autofix.Api.Models;
using Autofix.Application.Inventory.Commands.CreateInventoryItem;
using Autofix.Application.Inventory.Commands.DeleteInventoryItem;
using Autofix.Application.Inventory.Commands.UpdateInventoryItem;
using Autofix.Application.Inventory.Queries.GetInventoryItemById;
using Autofix.Application.Inventory.Queries.GetInventoryItems;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

public sealed class InventoryController(IMediator mediator) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateInventoryItemCommand command,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return OkResult(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetInventoryItemsQuery(), cancellationToken);
        return OkResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetInventoryItemByIdQuery(id), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Inventory item {id} not found"));
        }

        return OkResult(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateInventoryItemCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequestResult("Route id does not match body id.");
        }

        var result = await mediator.Send(command, cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Inventory item {id} not found"));
        }

        return OkResult(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await mediator.Send(new DeleteInventoryItemCommand(id), cancellationToken);

        if (!deleted)
        {
            return NotFound(ApiResult.Failure($"Inventory item {id} not found"));
        }

        return OkResult(new { });
    }
}
