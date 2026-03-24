using Autofix.Application.Employees.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Employees.Commands.UpdateEmployee;

public sealed record UpdateEmployeeCommand(
    Guid Id,
    Guid UserId,
    string FullName,
    EmployeeRole Role,
    bool IsActive
) : IRequest<EmployeeDto?>;
