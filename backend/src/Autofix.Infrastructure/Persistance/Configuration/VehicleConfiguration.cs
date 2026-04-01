using Autofix.Domain.Entities.People;
using Autofix.Domain.Entities.Vehicles;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Autofix.Infrastructure.Persistance.Configuration;

public sealed class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.LicensePlate)
            .HasMaxLength(20);

        builder.Property(x => x.Vin)
            .HasMaxLength(17);

        builder.Property(x => x.Make)
            .HasMaxLength(100);

        builder.Property(x => x.Model)
            .HasMaxLength(100);

        builder.Property(x => x.Trim)
            .HasMaxLength(100);

        builder.Property(x => x.Engine)
            .HasMaxLength(100);

        builder.HasIndex(x => x.Vin)
            .IsUnique()
            .HasFilter("\"vin\" IS NOT NULL AND \"is_deleted\" = false");

        builder.HasOne<Customer>(x => x.OwnerCustomer)
            .WithMany()
            .HasForeignKey(x => x.OwnerCustomerId);
    }
}

