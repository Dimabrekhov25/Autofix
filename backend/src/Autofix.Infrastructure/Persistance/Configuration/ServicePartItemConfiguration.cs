using Autofix.Domain.Entities.Inventory;
using Autofix.Domain.Entities.ServiceOrders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Autofix.Infrastructure.Persistance.Configuration;

public sealed class ServicePartItemConfiguration : IEntityTypeConfiguration<ServicePartItem>
{
    public void Configure(EntityTypeBuilder<ServicePartItem> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne<Part>(x => x.Part)
            .WithMany()
            .HasForeignKey(x => x.PartId);
    }
}

