using Autofix.Application.Common.Interfaces;
using Autofix.Application.Employees.Dtos;
using Autofix.Application.Employees.Mapping;
using Autofix.Domain.Entities.People;
using MediatR;

namespace Autofix.Application.Employees.Commands.CreateEmployee;

public sealed class CreateEmployeeHandler(IEmployeeRepository repository)
    : IRequestHandler<CreateEmployeeCommand, EmployeeDto>
{
    public async Task<EmployeeDto> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = new Employee
        {
            UserId = request.UserId,
            FullName = request.FullName,
            Role = request.Role,
            IsActive = request.IsActive
        };

        var saved = await repository.AddAsync(employee, cancellationToken);
        return saved.ToDto();
    }
}
