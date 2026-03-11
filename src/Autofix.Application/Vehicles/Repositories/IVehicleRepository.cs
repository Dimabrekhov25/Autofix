using Autofix.Domain.Entities.Vehicles;

namespace Autofix.Application.Vehicles.Repositories;

public interface IVehicleRepository
{
    Task<Vehicle> AddAsync(Vehicle vehicle, CancellationToken cancellationToken);
    Task<Vehicle?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyList<Vehicle>> GetAllAsync(CancellationToken cancellationToken);
}
