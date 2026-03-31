using Autofix.Domain.Common;
using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.Catalog;
using Autofix.Domain.Entities.Finance;
using Autofix.Domain.Entities.Inventory;
using Autofix.Domain.Entities.People;
using Autofix.Domain.Entities.ServiceOrders;
using Autofix.Domain.Entities.Vehicles;
using Autofix.Infrastructure.Auth.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Autofix.Infrastructure.Persistance;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<BookingServiceItem> BookingServiceItems => Set<BookingServiceItem>();
    public DbSet<ServiceCatalogItem> ServiceCatalogItems => Set<ServiceCatalogItem>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceLineItem> InvoiceLineItems => Set<InvoiceLineItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();
    public DbSet<InventoryMovement> InventoryMovements => Set<InventoryMovement>();
    public DbSet<Part> Parts => Set<Part>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<DiagnosisItem> DiagnosisItems => Set<DiagnosisItem>();
    public DbSet<ServiceOrder> ServiceOrders => Set<ServiceOrder>();
    public DbSet<ServicePartItem> ServicePartItems => Set<ServicePartItem>();
    public DbSet<ServiceWorkItem> ServiceWorkItems => Set<ServiceWorkItem>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
    
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        HandleSoftDelete();
        return base.SaveChangesAsync(cancellationToken);
    }
    
    private void HandleSoftDelete()
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.State == EntityState.Deleted && e.Entity is BaseEntity);

        foreach (var entry in entries)
        {
            var entity = (BaseEntity)entry.Entity;
            entry.State = EntityState.Modified;
            entity.IsDeleted = true;
            entity.DeletedAt = DateTime.UtcNow;
        }
    }
}
