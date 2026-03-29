using Autofix.Domain.Entities.Inventory;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Autofix.Infrastructure.Persistance.Configuration;

public sealed class InventoryMovementConfiguration : IEntityTypeConfiguration<InventoryMovement>
{
    public void Configure(EntityTypeBuilder<InventoryMovement> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne<Part>(x => x.Part)
            .WithMany()
            .HasForeignKey(x => x.PartId);
    }
}

