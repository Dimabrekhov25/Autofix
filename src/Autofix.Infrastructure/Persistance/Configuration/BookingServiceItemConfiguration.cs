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

        builder.HasOne<ServiceCatalogItem>(x => x.ServiceCatalogItem)
            .WithMany()
            .HasForeignKey(x => x.ServiceCatalogItemId);
    }
}

