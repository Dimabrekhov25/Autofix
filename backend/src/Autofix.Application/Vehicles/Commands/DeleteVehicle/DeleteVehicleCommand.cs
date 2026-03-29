using MediatR;

namespace Autofix.Application.Vehicles.Commands.DeleteVehicle;

public sealed record DeleteVehicleCommand(Guid Id) : IRequest<bool>;
