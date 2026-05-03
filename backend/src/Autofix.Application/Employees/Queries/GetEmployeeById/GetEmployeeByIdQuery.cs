using Autofix.Application.Employees.Dtos;
using MediatR;

namespace Autofix.Application.Employees.Queries.GetEmployeeById;

/// <summary>
/// Loads a single employee by id.
/// </summary>
public sealed record GetEmployeeByIdQuery(Guid Id) : IRequest<EmployeeDto?>;
