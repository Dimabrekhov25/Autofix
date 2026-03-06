using Autofix.Domain.Entities.Finance;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Autofix.Infrastructure.Persistance.Configuration;

public sealed class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne<Invoice>(x => x.Invoice)
            .WithMany()
            .HasForeignKey(x => x.InvoiceId);
    }
}

