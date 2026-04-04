using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.People;
using Autofix.Domain.Entities.ServiceOrders;
using Autofix.Domain.Entities.Vehicles;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Autofix.Infrastructure.Persistance.Configuration;

public sealed class ServiceOrderConfiguration : IEntityTypeConfiguration<ServiceOrder>
{
    public void Configure(EntityTypeBuilder<ServiceOrder> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne<Booking>(x => x.Booking)
            .WithMany()
            .HasForeignKey(x => x.BookingId);

        builder.HasIndex(x => x.BookingId)
            .IsUnique()
            .HasFilter("\"is_deleted\" = false");

        builder.HasOne<Customer>(x => x.Customer)
            .WithMany()
            .HasForeignKey(x => x.CustomerId);

        builder.HasOne<Vehicle>(x => x.Vehicle)
            .WithMany()
            .HasForeignKey(x => x.VehicleId);

        builder.HasOne<Employee>(x => x.Mechanic)
            .WithMany()
            .HasForeignKey(x => x.MechanicId)
            .IsRequired(false);

        builder.HasMany(x => x.DiagnosisItems)
            .WithOne(x => x.ServiceOrder)
            .HasForeignKey(x => x.ServiceOrderId);

        builder.HasMany(x => x.WorkItems)
            .WithOne(x => x.ServiceOrder)
            .HasForeignKey(x => x.ServiceOrderId);

        builder.HasMany(x => x.PartItems)
            .WithOne(x => x.ServiceOrder)
            .HasForeignKey(x => x.ServiceOrderId);
    }
}

