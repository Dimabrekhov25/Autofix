using System.Security.Claims;
using System.Text;
using Autofix.Application.Common.Interfaces;
using Autofix.Application.Common.Interfaces.Auth;
using Autofix.Application.Common.Security;
using Autofix.Domain.Constants;
using Autofix.Infrastructure.Auth;
using Autofix.Infrastructure.Auth.Authorization;
using Autofix.Infrastructure.Auth.Entities;
using Autofix.Infrastructure.Auth.Options;
using Autofix.Infrastructure.Persistance;
using Autofix.Infrastructure.Persistance.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

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

        builder.Services
            .AddOptions<JwtOptions>()
            .Bind(builder.Configuration.GetSection(JwtOptions.SectionName))
            .Validate(
                options =>
                    !string.IsNullOrWhiteSpace(options.Issuer) &&
                    !string.IsNullOrWhiteSpace(options.Audience) &&
                    !string.IsNullOrWhiteSpace(options.Key) &&
                    options.Key.Length >= 32 &&
                    options.AccessTokenLifetimeMinutes > 0 &&
                    options.RefreshTokenLifetimeDays > 0,
                "JWT configuration is invalid.")
            .ValidateOnStart();

        builder.Services
            .AddOptions<IdentitySeedOptions>()
            .Bind(builder.Configuration.GetSection(IdentitySeedOptions.SectionName));

        builder.Services
            .AddOptions<GoogleAuthOptions>()
            .Bind(builder.Configuration.GetSection(GoogleAuthOptions.SectionName));

        builder.Services
            .AddIdentityCore<ApplicationUser>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.Password.RequiredLength = 12;
                options.Password.RequireDigit = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequiredUniqueChars = 4;
                options.Lockout.AllowedForNewUsers = true;
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10);
            })
            .AddRoles<IdentityRole<Guid>>()
            .AddSignInManager()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        var jwtSection = builder.Configuration.GetSection(JwtOptions.SectionName);
        var jwtOptions = jwtSection.Get<JwtOptions>() ?? new JwtOptions();
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key));

        builder.Services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
                options.SaveToken = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtOptions.Issuer,
                    ValidAudience = jwtOptions.Audience,
                    IssuerSigningKey = signingKey,
                    ClockSkew = TimeSpan.FromSeconds(30),
                    NameClaimType = ClaimTypes.Name,
                    RoleClaimType = ClaimTypes.Role
                };
            });

        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy(PolicyNames.ActiveUser, policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.AddRequirements(new ActiveUserRequirement());
            });

            options.AddPolicy(PolicyNames.AdminOnly, policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireRole(RoleNames.Admin);
                policy.AddRequirements(new ActiveUserRequirement());
            });
        });

        builder.Services.AddScoped<IIdentityService, IdentityService>();
        builder.Services.AddScoped<IAuthorizationHandler, ActiveUserRequirementHandler>();
        builder.Services.AddScoped<IPartRepository, PartRepository>();
        builder.Services.AddScoped<IServiceCatalogRepository, ServiceCatalogRepository>();
        builder.Services.AddScoped<IBookingRepository, BookingRepository>();
        builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
        builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
        builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
    }

    public static async Task InitializeInfrastructureAsync(this IHost host, CancellationToken cancellationToken = default)
    {
        await using var scope = host.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await dbContext.Database.MigrateAsync(cancellationToken);
        await SeedIdentityAsync(scope.ServiceProvider, cancellationToken);
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

    private static async Task SeedIdentityAsync(IServiceProvider serviceProvider, CancellationToken cancellationToken)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var seedOptions = serviceProvider.GetRequiredService<Microsoft.Extensions.Options.IOptions<IdentitySeedOptions>>().Value;

        foreach (var role in RoleNames.All)
        {
            if (await roleManager.RoleExistsAsync(role))
            {
                continue;
            }

            var result = await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            if (!result.Succeeded)
            {
                throw new InvalidOperationException($"Failed to seed role '{role}': {string.Join("; ", result.Errors.Select(x => x.Description))}");
            }
        }

        if (string.IsNullOrWhiteSpace(seedOptions.AdminUserName) ||
            string.IsNullOrWhiteSpace(seedOptions.AdminEmail) ||
            string.IsNullOrWhiteSpace(seedOptions.AdminPassword))
        {
            return;
        }

        var adminUser = await userManager.Users.FirstOrDefaultAsync(
            x => x.NormalizedEmail == seedOptions.AdminEmail.ToUpperInvariant(),
            cancellationToken);

        if (adminUser is null)
        {
            adminUser = new ApplicationUser
            {
                UserName = seedOptions.AdminUserName.Trim(),
                Email = seedOptions.AdminEmail.Trim(),
                FullName = string.IsNullOrWhiteSpace(seedOptions.AdminFullName)
                    ? "System Administrator"
                    : seedOptions.AdminFullName.Trim(),
                IsActive = true,
                CreatedAtUtc = DateTime.UtcNow,
                EmailConfirmed = true
            };

            var createResult = await userManager.CreateAsync(adminUser, seedOptions.AdminPassword);
            if (!createResult.Succeeded)
            {
                throw new InvalidOperationException($"Failed to seed admin user: {string.Join("; ", createResult.Errors.Select(x => x.Description))}");
            }
        }

        if (!await userManager.IsInRoleAsync(adminUser, RoleNames.Admin))
        {
            var addRoleResult = await userManager.AddToRoleAsync(adminUser, RoleNames.Admin);
            if (!addRoleResult.Succeeded)
            {
                throw new InvalidOperationException($"Failed to assign admin role: {string.Join("; ", addRoleResult.Errors.Select(x => x.Description))}");
            }
        }
    }
}
