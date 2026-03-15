using Autofix.Application.Common.Interfaces;
using Autofix.Application.Employees.Dtos;
using Autofix.Application.Employees.Mapping;
using MediatR;

namespace Autofix.Application.Employees.Commands.UpdateEmployee;

public sealed class UpdateEmployeeHandler(IEmployeeRepository repository)
    : IRequestHandler<UpdateEmployeeCommand, EmployeeDto?>
{
    public async Task<EmployeeDto?> Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = await repository.GetByIdAsync(request.Id, cancellationToken);

        if (employee is null)
        {
            return null;
        }

        employee.UserId = request.UserId;
        employee.FullName = request.FullName;
        employee.Role = request.Role;
        employee.IsActive = request.IsActive;
        employee.UpdatedAt = DateTime.UtcNow;

        await repository.UpdateAsync(employee, cancellationToken);
        return employee.ToDto();
    }
}
