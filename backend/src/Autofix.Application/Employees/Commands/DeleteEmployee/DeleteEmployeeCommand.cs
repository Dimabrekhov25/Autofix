using MediatR;

namespace Autofix.Application.Employees.Commands.DeleteEmployee;

/// <summary>
/// Deletes an employee by id.
/// </summary>
public sealed record DeleteEmployeeCommand(Guid Id) : IRequest<bool>;
