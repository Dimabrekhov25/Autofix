using MediatR;

namespace Autofix.Application.Vehicles.Commands.DeleteVehicle;

/// <summary>
/// Deletes a vehicle by id.
/// </summary>
public sealed record DeleteVehicleCommand(Guid Id) : IRequest<bool>;
