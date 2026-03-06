using System.Reflection;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Autofix.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(assembly);
        });
        
        return services;
    }
}