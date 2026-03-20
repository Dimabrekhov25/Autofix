using Autofix.Api.Models;
using Autofix.Application.Bookings.Commands.CreateBooking;
using Autofix.Application.Bookings.Commands.DeleteBooking;
using Autofix.Application.Bookings.Commands.UpdateBooking;
using Autofix.Application.Bookings.Queries.GetBookingById;
using Autofix.Application.Bookings.Queries.GetBookings;
using Autofix.Application.Bookings.Results;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Autofix.Api.Controllers;

public sealed class BookingsController(IMediator mediator) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingCommand command, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return ToActionResult(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetBookingsQuery(), cancellationToken);
        return OkResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetBookingByIdQuery(id), cancellationToken);

        if (result is null)
        {
            return NotFound(ApiResult.Failure($"Booking {id} not found"));
        }

        return OkResult(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateBookingCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequestResult("Route id does not match body id.");
        }

        var result = await mediator.Send(command, cancellationToken);
        return ToActionResult(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await mediator.Send(new DeleteBookingCommand(id), cancellationToken);

        if (!deleted)
        {
            return NotFound(ApiResult.Failure($"Booking {id} not found"));
        }

        return OkResult(new { });
    }

    private IActionResult ToActionResult(BookingMutationResult result)
    {
        return result.Error switch
        {
            BookingMutationError.None => OkResult(result.Booking!),
            BookingMutationError.BookingNotFound => NotFound(ApiResult.Failure("Booking not found")),
            BookingMutationError.CustomerNotFound => NotFound(ApiResult.Failure("Customer not found")),
            BookingMutationError.VehicleNotFound => NotFound(ApiResult.Failure("Vehicle not found")),
            BookingMutationError.VehicleDoesNotBelongToCustomer => BadRequest(ApiResult.Failure(
                "The selected vehicle does not belong to the specified customer.")),
            BookingMutationError.ServiceCatalogItemsNotFound => BadRequest(ApiResult.Failure(
                "One or more selected services were not found or are inactive.")),
            BookingMutationError.TimeSlotUnavailable => BadRequest(ApiResult.Failure(
                "The selected vehicle is already booked for the requested time range.")),
            _ => BadRequest(ApiResult.Failure("Booking request could not be processed."))
        };
    }
}
