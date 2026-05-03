using Autofix.Domain.Enum;

namespace Autofix.Application.Employees.Dtos;

/// <summary>
/// Employee read model (user link, name, role, and active flag).
/// </summary>
public sealed record EmployeeDto(
    Guid Id,
    Guid UserId,
    string FullName,
    EmployeeRole Role,
    bool IsActive
);
