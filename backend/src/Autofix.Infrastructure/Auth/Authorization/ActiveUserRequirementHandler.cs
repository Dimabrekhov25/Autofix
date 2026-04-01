using System.Security.Claims;
using Autofix.Infrastructure.Auth.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace Autofix.Infrastructure.Auth.Authorization;

public sealed class ActiveUserRequirementHandler(UserManager<ApplicationUser> userManager)
    : AuthorizationHandler<ActiveUserRequirement>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ActiveUserRequirement requirement)
    {
        var subject = context.User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? context.User.FindFirstValue("sub");

        if (!Guid.TryParse(subject, out var userId))
        {
            return;
        }

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user?.IsActive == true)
        {
            context.Succeed(requirement);
        }
    }
}
