using Autofix.Api.Models;
using Autofix.Application.Vehicles.Commands.CreateVehicle;
using Autofix.Application.Vehicles.Queries.GetVehicleById;
using Autofix.Application.Vehicles.Queries.GetVehicles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

public sealed class VehiclesController(IMediator mediator) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateVehicleCommand command, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return OkResult(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] GetVehiclesQuery query,
        CancellationToken cancellationToken = default)
    {
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetVehicleByIdQuery(id), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Vehicle {id} not found"));
        }

        return OkResult(result);
    }
}
