using Autofix.Application.Employees.Dtos;
using MediatR;

namespace Autofix.Application.Employees.Queries.GetEmployeeById;

public sealed record GetEmployeeByIdQuery(Guid Id) : IRequest<EmployeeDto?>;
