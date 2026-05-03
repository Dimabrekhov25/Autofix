using Autofix.Application.Vehicles.Dtos;
using MediatR;

namespace Autofix.Application.Vehicles.Queries.GetVehicleById;

/// <summary>
/// Loads a single vehicle by id.
/// </summary>
public sealed record GetVehicleByIdQuery(Guid Id) : IRequest<VehicleDto?>;
