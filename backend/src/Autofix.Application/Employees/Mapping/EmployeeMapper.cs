using Autofix.Application.Employees.Dtos;
using Autofix.Domain.Entities.People;

namespace Autofix.Application.Employees.Mapping;

/// <summary>
/// Maps domain <see cref="Employee"/> to <see cref="EmployeeDto"/>.
/// </summary>
public static class EmployeeMapper
{
    /// <summary>Projects entity fields into a DTO.</summary>
    public static EmployeeDto ToDto(this Employee entity)
        => new(entity.Id, entity.UserId, entity.FullName, entity.Role, entity.IsActive);
}
