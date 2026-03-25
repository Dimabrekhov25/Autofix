using Autofix.Domain.Entities.ServiceOrders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Autofix.Infrastructure.Persistance.Configuration;

public sealed class ServiceWorkItemConfiguration : IEntityTypeConfiguration<ServiceWorkItem>
{
    public void Configure(EntityTypeBuilder<ServiceWorkItem> builder)
    {
        builder.HasKey(x => x.Id);
    }
}

