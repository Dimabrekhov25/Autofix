using Autofix.Domain.Entities.Booking;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Autofix.Infrastructure.Persistance.Configuration;

public sealed class BookingTimeSlotConfiguration : IEntityTypeConfiguration<BookingTimeSlot>
{
    public void Configure(EntityTypeBuilder<BookingTimeSlot> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Label)
            .HasMaxLength(32);

        builder.HasIndex(x => x.StartAt)
            .IsUnique()
            .HasFilter("\"is_deleted\" = false");
    }
}
