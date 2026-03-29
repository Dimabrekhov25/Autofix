using Autofix.Application.Common.Interfaces;
using Autofix.Infrastructure.Persistance;
using Autofix.Infrastructure.Persistance.Repositories;
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

        builder.Services.AddScoped<IServiceCatalogRepository, ServiceCatalogRepository>();
        builder.Services.AddScoped<IBookingRepository, BookingRepository>();
        builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
        builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
        builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
        builder.Services.AddScoped<IUserRepository, UserRepository>();
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
