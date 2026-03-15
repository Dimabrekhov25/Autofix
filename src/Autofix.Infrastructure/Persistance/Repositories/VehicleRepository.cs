using Autofix.Application.Common.Models;
using Autofix.Application.Common.Interfaces;
using Autofix.Domain.Entities.Vehicles;
using Microsoft.EntityFrameworkCore;

namespace Autofix.Infrastructure.Persistance.Repositories;

public sealed class VehicleRepository(ApplicationDbContext dbContext) : IVehicleRepository
{
    public async Task<Vehicle> AddAsync(Vehicle vehicle, CancellationToken cancellationToken)
    {
        dbContext.Vehicles.Add(vehicle);
        await dbContext.SaveChangesAsync(cancellationToken);
        return vehicle;
    }

    public Task<Vehicle?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Vehicles
            .AsNoTracking()
            .FirstOrDefaultAsync(vehicle => vehicle.Id == id && !vehicle.IsDeleted, cancellationToken);
    }

    public async Task<IReadOnlyList<Vehicle>> GetPageAsync(
        PageRequest page,
        CancellationToken cancellationToken)
    {
        var vehicles = await dbContext.Vehicles
            .AsNoTracking()
            .Where(vehicle => !vehicle.IsDeleted)
            .OrderBy(vehicle => vehicle.LicensePlate)
            .Skip(page.Skip)
            .Take(page.Take)
            .ToListAsync(cancellationToken);

        return vehicles;
    }

    public Task<int> CountAsync(CancellationToken cancellationToken)
    {
        return dbContext.Vehicles
            .CountAsync(vehicle => !vehicle.IsDeleted, cancellationToken);
    }
}
