using Autofix.Application.Customers.Dtos;
using MediatR;

namespace Autofix.Application.Customers.Queries.GetCustomers;

/// <summary>
/// Lists all customers as DTOs.
/// </summary>
public sealed record GetCustomersQuery() : IRequest<IReadOnlyList<CustomerDto>>;
