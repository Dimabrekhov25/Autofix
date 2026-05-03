using Autofix.Api.Models;
using Autofix.Application.Vehicles.Commands.CreateVehicle;
using Autofix.Application.Vehicles.Commands.DeleteVehicle;
using Autofix.Application.Vehicles.Commands.UpdateVehicle;
using Autofix.Application.Vehicles.Queries.DecodeVin;
using Autofix.Application.Vehicles.Queries.GetVehicleById;
using Autofix.Application.Vehicles.Queries.GetVehicles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

/// <summary>
/// API for customer vehicles (garage) and VIN decode helpers.
/// </summary>
public sealed class VehiclesController(IMediator mediator) : BaseController
{
    /// <summary>
    /// Registers a vehicle.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateVehicleCommand command, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Lists vehicles using query filters bound to <see cref="GetVehiclesQuery"/>.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] GetVehiclesQuery query,
        CancellationToken cancellationToken = default)
    {
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Returns one vehicle by id, or 404.
    /// </summary>
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

    /// <summary>
    /// Decodes a VIN and returns normalized vehicle attributes (provider-dependent).
    /// </summary>
    [HttpPost("decode-vin")]
    public async Task<IActionResult> DecodeVin([FromBody] DecodeVinQuery query, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(query, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Updates a vehicle; route id must match <see cref="UpdateVehicleCommand.Id"/>.
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateVehicleCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequestResult("Route id does not match body id.");
        }

        var result = await mediator.Send(command, cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Vehicle {id} not found"));
        }

        return OkResult(result);
    }

    /// <summary>
    /// Deletes a vehicle; 404 when not found.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await mediator.Send(new DeleteVehicleCommand(id), cancellationToken);

        if (!deleted)
        {
            return NotFound(ApiResult.Failure($"Vehicle {id} not found"));
        }

        return OkResult(new { });
    }
}
