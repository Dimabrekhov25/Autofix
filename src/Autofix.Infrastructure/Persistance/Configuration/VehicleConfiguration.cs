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

        builder.HasOne<Customer>(x => x.OwnerCustomer)
            .WithMany()
            .HasForeignKey(x => x.OwnerCustomerId);
    }
}

