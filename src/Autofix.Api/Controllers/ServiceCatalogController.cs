using Autofix.Api.Models;
using Autofix.Application.ServiceCatalog.Commands.CreateServiceCatalogItem;
using Autofix.Application.ServiceCatalog.Commands.DeleteServiceCatalogItem;
using Autofix.Application.ServiceCatalog.Commands.UpdateServiceCatalogItem;
using Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItemById;
using Autofix.Application.ServiceCatalog.Queries.GetServiceCatalogItems;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

public sealed class ServiceCatalogController(IMediator mediator) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateServiceCatalogItemCommand command, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return OkResult(result);
    }

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

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetServiceCatalogItemsQuery(), cancellationToken);
        return OkResult(result);
    }

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
