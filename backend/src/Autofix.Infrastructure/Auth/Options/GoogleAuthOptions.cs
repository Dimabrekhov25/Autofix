namespace Autofix.Infrastructure.Auth.Options;

public sealed class GoogleAuthOptions
{
    public const string SectionName = "GoogleAuth";

    public string[] AllowedAudiences { get; init; } = [];
}
