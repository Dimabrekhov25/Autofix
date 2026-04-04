using Autofix.Domain.Entities.Catalog;
using Autofix.Domain.Entities.Inventory;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Autofix.Infrastructure.Persistance.Configuration;

public sealed class ServiceCatalogPartRequirementConfiguration
    : IEntityTypeConfiguration<ServiceCatalogPartRequirement>
{
    public void Configure(EntityTypeBuilder<ServiceCatalogPartRequirement> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne<ServiceCatalogItem>(x => x.ServiceCatalogItem)
            .WithMany(x => x.RequiredParts)
            .HasForeignKey(x => x.ServiceCatalogItemId);

        builder.HasOne<Part>(x => x.Part)
            .WithMany()
            .HasForeignKey(x => x.PartId);

        builder.HasIndex(x => new { x.ServiceCatalogItemId, x.PartId })
            .IsUnique()
            .HasFilter("\"is_deleted\" = false");
    }
}
