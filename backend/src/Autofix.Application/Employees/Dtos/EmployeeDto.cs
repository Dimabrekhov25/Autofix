using Autofix.Domain.Enum;

namespace Autofix.Application.Employees.Dtos;

public sealed record EmployeeDto(
    Guid Id,
    Guid UserId,
    string FullName,
    EmployeeRole Role,
    bool IsActive
);
