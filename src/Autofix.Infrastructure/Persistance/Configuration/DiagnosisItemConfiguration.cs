using Autofix.Domain.Entities.ServiceOrders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Autofix.Infrastructure.Persistance.Configuration;

public sealed class DiagnosisItemConfiguration : IEntityTypeConfiguration<DiagnosisItem>
{
    public void Configure(EntityTypeBuilder<DiagnosisItem> builder)
    {
        builder.HasKey(x => x.Id);
    }
}

