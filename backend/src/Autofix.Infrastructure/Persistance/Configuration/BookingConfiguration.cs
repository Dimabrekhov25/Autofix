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

        builder.HasOne<Customer>(x => x.Customer)
            .WithMany()
            .HasForeignKey(x => x.CustomerId);

        builder.HasOne<Vehicle>(x => x.Vehicle)
            .WithMany()
            .HasForeignKey(x => x.VehicleId);

        builder.HasMany(x => x.Services)
            .WithOne(x => x.Booking)
            .HasForeignKey(x => x.BookingId);
    }
}
