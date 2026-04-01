using Autofix.Domain.Constants;

namespace Autofix.Domain.Exceptions;

public sealed class UnauthorizedException(string message, string? code = null)
    : DomainException(message)
{
    public override string Code => code ?? ErrorCodes.Unauthorized;
}
