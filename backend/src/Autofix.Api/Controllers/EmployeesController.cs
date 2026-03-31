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

[Authorize(Roles = RoleNames.Admin)]
public sealed class EmployeesController(IMediator mediator) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeCommand command, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return OkResult(result);
    }

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

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetEmployeesQuery(), cancellationToken);
        return OkResult(result);
    }

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
