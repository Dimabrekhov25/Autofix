using Autofix.Application.Employees.Dtos;
using MediatR;

namespace Autofix.Application.Employees.Queries.GetEmployees;

/// <summary>
/// Lists all employees.
/// </summary>
public sealed record GetEmployeesQuery() : IRequest<IReadOnlyList<EmployeeDto>>;
