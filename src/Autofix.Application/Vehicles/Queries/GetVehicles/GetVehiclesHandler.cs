using Autofix.Application.Common.Models;
using Autofix.Application.Vehicles.Dtos;
using Autofix.Application.Vehicles.Repositories;
using MediatR;

namespace Autofix.Application.Vehicles.Queries.GetVehicles;

public sealed class GetVehiclesHandler(IVehicleRepository repository)
    : IRequestHandler<GetVehiclesQuery, PagedResult<VehicleDto>>
{
    public async Task<PagedResult<VehicleDto>> Handle(GetVehiclesQuery request, CancellationToken cancellationToken)
    {
        var totalCount = await repository.CountAsync(cancellationToken);
        if (totalCount == 0)
        {
            return new PagedResult<VehicleDto>(
                Array.Empty<VehicleDto>(),
                request.Page.Page,
                request.Page.PageSize,
                0);
        }

        var vehicles = await repository.GetPageAsync(request.Page, cancellationToken);
        var items = vehicles
            .Select(vehicle => new VehicleDto(
                vehicle.Id,
                vehicle.OwnerCustomerId,
                vehicle.LicensePlate,
                vehicle.Make,
                vehicle.Model,
                vehicle.Year,
                vehicle.IsDrivable
            ))
            .ToList();

        return new PagedResult<VehicleDto>(
            items,
            request.Page.Page,
            request.Page.PageSize,
            totalCount);
    }
}
