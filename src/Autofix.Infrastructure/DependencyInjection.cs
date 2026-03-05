using Autofix.Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Autofix.Infrastructure;

public static class DependencyInjection
{
    public static void AddInfrastructure(this IHostApplicationBuilder builder)
    {
        builder.AddNpgsqlDbContext<ApplicationDbContext>("DefaultConnection",
            configureDbContextOptions: options =>
            {
                options.UseSnakeCaseNamingConvention();
            });

        //builder.Services.AddScoped<IBookingRepositories, BookingRepositories>();
    }
    public static IHostApplicationBuilder AddNpgsqlDbContext<TContext>(
        this IHostApplicationBuilder builder,
        string connectionName,
        Action<DbContextOptionsBuilder>? configureDbContextOptions = null)
        where TContext : DbContext
    {
        builder.Services.AddDbContext<TContext>(options =>
        {
            options.UseNpgsql(builder.Configuration.GetConnectionString(connectionName));
            configureDbContextOptions?.Invoke(options);
        });

        return builder;
    }
}
