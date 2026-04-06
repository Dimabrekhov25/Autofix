using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.People;
using Autofix.Domain.Entities.Vehicles;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Autofix.Infrastructure.Persistance.Configuration;

public sealed class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Currency)
            .HasMaxLength(3);

        builder.Property(x => x.Subtotal)
            .HasPrecision(18, 2);

        builder.Property(x => x.EstimatedLaborCost)
            .HasPrecision(18, 2);

        builder.Property(x => x.TaxAmount)
            .HasPrecision(18, 2);

        builder.Property(x => x.TotalEstimate)
            .HasPrecision(18, 2);

        builder.Property(x => x.Notes)
            .HasMaxLength(2000);

        builder.HasOne<Customer>(x => x.Customer)
            .WithMany()
            .HasForeignKey(x => x.CustomerId);

        builder.HasOne<Vehicle>(x => x.Vehicle)
            .WithMany()
            .HasForeignKey(x => x.VehicleId);

        builder.HasOne(x => x.BookingTimeSlot)
            .WithMany(x => x.Bookings)
            .HasForeignKey(x => x.BookingTimeSlotId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.BookingTimeSlotId)
            .IsUnique()
            .HasFilter("\"booking_time_slot_id\" IS NOT NULL AND \"is_deleted\" = false AND \"status\" <> 5");

        builder.HasMany(x => x.Services)
            .WithOne(x => x.Booking)
            .HasForeignKey(x => x.BookingId);

        builder.HasOne(x => x.ServiceOrder)
            .WithOne(x => x.Booking)
            .HasForeignKey<Domain.Entities.ServiceOrders.ServiceOrder>(x => x.BookingId);
    }
}
