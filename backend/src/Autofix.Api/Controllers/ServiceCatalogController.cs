using Autofix.Api.Models;
using Autofix.Application.ServiceCatalog.Commands.CreateServiceCatalogItem;
using Autofix.Application.ServiceCatalog.Commands.DeleteServiceCatalogItem;
using Autofix.Application.ServiceCatalog.Commands.UpdateServiceCatalogItem;
using Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItemById;
using Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItems;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

/// <summary>
/// API for workshop service catalog entries (priced services offered to customers).
/// </summary>
public sealed class ServiceCatalogController(IMediator mediator) : BaseController
{
    /// <summary>
    /// Creates a catalog item.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateServiceCatalogItemCommand command, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Returns one catalog item by id, or 404.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetServiceCatalogItemByIdQuery(id), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Service catalog item {id} not found"));
        }

        return OkResult(result);
    }

    /// <summary>
    /// Lists or filters catalog items via query string binding to <see cref="GetServiceCatalogItemsQuery"/>.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] GetServiceCatalogItemsQuery query,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Updates a catalog item; route id must match <see cref="UpdateServiceCatalogItemCommand.Id"/>.
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateServiceCatalogItemCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequestResult("Route id does not match body id.");
        }

        var result = await mediator.Send(command, cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Service catalog item {id} not found"));
        }

        return OkResult(result);
    }

    /// <summary>
    /// Deletes a catalog item; 404 when not found.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await mediator.Send(new DeleteServiceCatalogItemCommand(id), cancellationToken);

        if (!deleted)
        {
            return NotFound(ApiResult.Failure($"Service catalog item {id} not found"));
        }

        return OkResult(new { });
    }
}
