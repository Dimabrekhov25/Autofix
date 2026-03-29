using Autofix.Domain.Constants;

namespace Autofix.Domain.Exceptions;

public class BadRequestException(string message, string? code = null)
    : DomainException(message)
{
    public override string Code => code ?? ErrorCodes.BadRequest;
}
