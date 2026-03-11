using Autofix.Application.Vehicles.Dtos;
using MediatR;
using Autofix.Application.Common.Models;

namespace Autofix.Application.Vehicles.Queries.GetVehicles;

public sealed record GetVehiclesQuery(PageRequest? Pagination = null)
    : IRequest<PagedResult<VehicleDto>>
{
    public PageRequest Page => Pagination ?? PageRequest.Default;
}
