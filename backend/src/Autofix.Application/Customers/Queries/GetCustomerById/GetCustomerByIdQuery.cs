using Autofix.Application.Customers.Dtos;
using MediatR;

namespace Autofix.Application.Customers.Queries.GetCustomerById;

/// <summary>
/// Gets one customer by id; handler returns <c>null</c> if not found.
/// </summary>
public sealed record GetCustomerByIdQuery(Guid Id) : IRequest<CustomerDto?>;
