using FluentValidation;

namespace Autofix.Application.Bookings.Commands.UpdateBookingPaymentOption;

public sealed class UpdateBookingPaymentOptionCommandValidator : AbstractValidator<UpdateBookingPaymentOptionCommand>
{
    public UpdateBookingPaymentOptionCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.PaymentOption)
            .IsInEnum();
    }
}
