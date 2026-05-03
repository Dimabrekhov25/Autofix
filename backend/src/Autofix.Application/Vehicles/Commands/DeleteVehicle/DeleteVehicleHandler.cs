using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Vehicles.Commands.DeleteVehicle;

/// <summary>
/// Removes a vehicle via the repository.
/// </summary>
public sealed class DeleteVehicleHandler(IVehicleRepository repository)
    : IRequestHandler<DeleteVehicleCommand, bool>
{
    // Deletion semantics (soft/hard behavior) are encapsulated in repository implementation.
    /// <inheritdoc />
    public Task<bool> Handle(DeleteVehicleCommand request, CancellationToken cancellationToken)
        => repository.DeleteAsync(request.Id, cancellationToken);
}
