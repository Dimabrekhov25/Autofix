using Autofix.Api.Models;
using Autofix.Application.Parts.Commands.CreatePart;
using Autofix.Application.Parts.Commands.DeletePart;
using Autofix.Application.Parts.Commands.UpdatePart;
using Autofix.Application.Parts.Query.GetAllParts;
using Autofix.Application.Parts.Query.GetPartsById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

/// <summary>
/// API for part master data (SKUs, descriptions, pricing metadata used by inventory and service orders).
/// </summary>
public sealed class PartsController(IMediator mediator) : BaseController
{
    /// <summary>
    /// Creates a part definition.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePartCommand command, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Lists parts.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetPartsQuery(), cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Returns one part by id, or 404.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetPartByIdQuery(id), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Part {id} not found"));
        }

        return OkResult(result);
    }

    /// <summary>
    /// Updates a part; route id must match <see cref="UpdatePartCommand.Id"/>.
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdatePartCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequestResult("Route id does not match body id.");
        }

        var result = await mediator.Send(command, cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Part {id} not found"));
        }

        return OkResult(result);
    }

    /// <summary>
    /// Deletes a part; 404 when not found.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await mediator.Send(new DeletePartCommand(id), cancellationToken);

        if (!deleted)
        {
            return NotFound(ApiResult.Failure($"Part {id} not found"));
        }

        return OkResult(new { });
    }
}
