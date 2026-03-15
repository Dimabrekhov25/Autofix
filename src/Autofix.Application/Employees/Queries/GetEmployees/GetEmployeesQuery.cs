using Autofix.Application.Employees.Dtos;
using MediatR;

namespace Autofix.Application.Employees.Queries.GetEmployees;

public sealed record GetEmployeesQuery() : IRequest<IReadOnlyList<EmployeeDto>>;
