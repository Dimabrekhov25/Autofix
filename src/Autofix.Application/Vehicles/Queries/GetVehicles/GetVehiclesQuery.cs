using Autofix.Application.Vehicles.Dtos;
using MediatR;

namespace Autofix.Application.Vehicles.Queries.GetVehicles;

public sealed record GetVehiclesQuery() : IRequest<IReadOnlyList<VehicleDto>>;
