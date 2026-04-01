using Autofix.Application.Customers.Dtos;
using MediatR;

namespace Autofix.Application.Customers.Queries.GetCustomers;

public sealed record GetCustomersQuery() : IRequest<IReadOnlyList<CustomerDto>>;
