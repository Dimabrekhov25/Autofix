using Autofix.Api.Models;
using Autofix.Application.ServiceCatalog.Commands.CreateServiceCatalogItem;
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
}
