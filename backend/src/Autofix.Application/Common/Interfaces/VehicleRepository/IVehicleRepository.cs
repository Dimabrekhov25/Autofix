using Autofix.Application.Common.Models;
using Autofix.Domain.Entities.Vehicles;

namespace Autofix.Application.Common.Interfaces;

/// <summary>Customer vehicles: paged lists, VIN lookup, CRUD.</summary>
public interface IVehicleRepository
{
    /// <summary>Adds a vehicle.</summary>
    Task<Vehicle> AddAsync(Vehicle vehicle, CancellationToken cancellationToken);
    /// <summary>Gets by id.</summary>
    Task<Vehicle?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    /// <summary>Finds by VIN string.</summary>
    Task<Vehicle?> GetByVinAsync(string vin, CancellationToken cancellationToken);
    /// <summary>Paged vehicles with optional owner and VIN contains filter.</summary>
    Task<IReadOnlyList<Vehicle>> GetPageAsync(
        PageRequest page,
        Guid? ownerCustomerId,
        string? vin,
        CancellationToken cancellationToken);
    /// <summary>Count for the same filters as <see cref="GetPageAsync"/>.</summary>
    Task<int> CountAsync(
        Guid? ownerCustomerId,
        string? vin,
        CancellationToken cancellationToken);
    /// <summary>Persists changes.</summary>
    Task UpdateAsync(Vehicle vehicle, CancellationToken cancellationToken);
    /// <summary>Deletes by id; <c>true</c> if removed.</summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
