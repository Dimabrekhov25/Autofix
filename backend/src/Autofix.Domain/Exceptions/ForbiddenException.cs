using Autofix.Domain.Constants;

namespace Autofix.Domain.Exceptions;

public sealed class ForbiddenException(string message, string? code = null)
    : DomainException(message)
{
    public override string Code => code ?? ErrorCodes.Forbidden;
}
