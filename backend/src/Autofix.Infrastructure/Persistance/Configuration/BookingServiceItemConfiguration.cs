using Autofix.Domain.Entities.Booking;
using Autofix.Domain.Entities.Catalog;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Autofix.Infrastructure.Persistance.Configuration;

public sealed class BookingServiceItemConfiguration : IEntityTypeConfiguration<BookingServiceItem>
{
    public void Configure(EntityTypeBuilder<BookingServiceItem> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .HasMaxLength(200);

        builder.Property(x => x.Description)
            .HasMaxLength(2000);

        builder.Property(x => x.BasePrice)
            .HasPrecision(18, 2);

        builder.Property(x => x.EstimatedLaborCost)
            .HasPrecision(18, 2);

        builder.HasOne<ServiceCatalogItem>(x => x.ServiceCatalogItem)
            .WithMany()
            .HasForeignKey(x => x.ServiceCatalogItemId);
    }
}

