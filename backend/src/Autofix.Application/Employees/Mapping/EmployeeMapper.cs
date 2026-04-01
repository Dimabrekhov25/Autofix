using Autofix.Application.Employees.Dtos;
using Autofix.Domain.Entities.People;

namespace Autofix.Application.Employees.Mapping;

public static class EmployeeMapper
{
    public static EmployeeDto ToDto(this Employee entity)
        => new(entity.Id, entity.UserId, entity.FullName, entity.Role, entity.IsActive);
}
