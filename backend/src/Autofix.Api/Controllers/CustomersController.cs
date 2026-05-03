using Autofix.Api.Models;
using Autofix.Application.Customers.Commands.CreateCustomer;
using Autofix.Application.Customers.Commands.DeleteCustomer;
using Autofix.Application.Customers.Commands.UpdateCustomer;
using Autofix.Application.Customers.Queries.GetCustomerById;
using Autofix.Application.Customers.Queries.GetCustomers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

/// <summary>
/// CRUD-style API for customer records.
/// </summary>
public sealed class CustomersController(IMediator mediator) : BaseController
{
    /// <summary>
    /// Creates a customer from the request body.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerCommand command, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Returns all customers (or a filtered list, depending on handler/query defaults).
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetCustomersQuery(), cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Returns a single customer by id, or 404 if missing.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetCustomerByIdQuery(id), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Customer {id} not found"));
        }

        return OkResult(result);
    }

    /// <summary>
    /// Updates a customer; route id must match <see cref="UpdateCustomerCommand.Id"/> in the body.
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateCustomerCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequestResult("Route id does not match body id.");
        }

        var result = await mediator.Send(command, cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Customer {id} not found"));
        }

        return OkResult(result);
    }

    /// <summary>
    /// Deletes a customer by id; 404 when not found.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await mediator.Send(new DeleteCustomerCommand(id), cancellationToken);

        if (!deleted)
        {
            return NotFound(ApiResult.Failure($"Customer {id} not found"));
        }

        return OkResult(new { });
    }
}
