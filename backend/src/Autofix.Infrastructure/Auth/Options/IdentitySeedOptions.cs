namespace Autofix.Infrastructure.Auth.Options;

public sealed class IdentitySeedOptions
{
    public const string SectionName = "IdentitySeed";

    public string? AdminUserName { get; init; }
    public string? AdminEmail { get; init; }
    public string? AdminFullName { get; init; }
    public string? AdminPassword { get; init; }
}
