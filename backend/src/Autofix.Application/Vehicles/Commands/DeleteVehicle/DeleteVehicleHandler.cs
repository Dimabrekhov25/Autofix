using Autofix.Application.Common.Interfaces;
using MediatR;

namespace Autofix.Application.Vehicles.Commands.DeleteVehicle;

public sealed class DeleteVehicleHandler(IVehicleRepository repository)
    : IRequestHandler<DeleteVehicleCommand, bool>
{
    public Task<bool> Handle(DeleteVehicleCommand request, CancellationToken cancellationToken)
        => repository.DeleteAsync(request.Id, cancellationToken);
}
