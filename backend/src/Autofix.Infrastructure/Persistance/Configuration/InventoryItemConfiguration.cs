using Autofix.Domain.Entities.Inventory;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Autofix.Infrastructure.Persistance.Configuration;

public sealed class InventoryItemConfiguration : IEntityTypeConfiguration<InventoryItem>
{
    public void Configure(EntityTypeBuilder<InventoryItem> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne<Part>(x => x.Part)
            .WithMany()
            .HasForeignKey(x => x.PartId);

        builder.HasIndex(x => x.PartId)
            .IsUnique()
            .HasFilter("\"is_deleted\" = false");
    }
}

