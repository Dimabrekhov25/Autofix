using Autofix.Api.Models;
using Autofix.Application.Employees.Commands.CreateEmployee;
using Autofix.Application.Employees.Commands.DeleteEmployee;
using Autofix.Application.Employees.Commands.UpdateEmployee;
using Autofix.Application.Employees.Queries.GetEmployeeById;
using Autofix.Application.Employees.Queries.GetEmployees;
using Autofix.Domain.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

/// <summary>
/// Employee administration. All actions require the <see cref="RoleNames.Admin"/> role.
/// </summary>
[Authorize(Roles = RoleNames.Admin)]
public sealed class EmployeesController(IMediator mediator) : BaseController
{
    /// <summary>
    /// Creates an employee from the request body.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeCommand command, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Updates an employee; route id must match <see cref="UpdateEmployeeCommand.Id"/>.
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateEmployeeCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequestResult("Route id does not match body id.");
        }

        var result = await mediator.Send(command, cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Employee {id} not found"));
        }

        return OkResult(result);
    }

    /// <summary>
    /// Deletes an employee by id; 404 when not found.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await mediator.Send(new DeleteEmployeeCommand(id), cancellationToken);

        if (!deleted)
        {
            return NotFound(ApiResult.Failure($"Employee {id} not found"));
        }

        return OkResult(new { });
    }

    /// <summary>
    /// Lists employees.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetEmployeesQuery(), cancellationToken);
        return OkResult(result);
    }

    /// <summary>
    /// Returns one employee by id, or 404.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetEmployeeByIdQuery(id), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Employee {id} not found"));
        }

        return OkResult(result);
    }
}
