using Autofix.Application.Employees.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Employees.Commands.CreateEmployee;

/// <summary>
/// Creates an employee profile linked to an application user.
/// </summary>
public sealed record CreateEmployeeCommand(
    Guid UserId,
    string FullName,
    EmployeeRole Role,
    bool IsActive = true
) : IRequest<EmployeeDto>;
