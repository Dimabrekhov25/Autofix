using Autofix.Application.Employees.Dtos;
using Autofix.Domain.Enum;
using MediatR;

namespace Autofix.Application.Employees.Commands.CreateEmployee;

public sealed record CreateEmployeeCommand(
    Guid UserId,
    string FullName,
    EmployeeRole Role,
    bool IsActive = true
) : IRequest<EmployeeDto>;
