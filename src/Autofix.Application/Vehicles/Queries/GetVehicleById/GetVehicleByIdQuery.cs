using Autofix.Application.Vehicles.Dtos;
using MediatR;

namespace Autofix.Application.Vehicles.Queries.GetVehicleById;

public sealed record GetVehicleByIdQuery(Guid Id) : IRequest<VehicleDto?>;
