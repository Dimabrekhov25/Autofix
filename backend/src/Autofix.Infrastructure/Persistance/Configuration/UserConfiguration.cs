using Autofix.Domain.Entities.People;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Autofix.Infrastructure.Persistance.Configuration;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.Employee)
            .WithOne(x => x.User)
            .HasForeignKey<Employee>(x => x.UserId);

        builder.HasOne(x => x.Customer)
            .WithOne(x => x.User)
            .HasForeignKey<Customer>(x => x.UserId);
    }
}

