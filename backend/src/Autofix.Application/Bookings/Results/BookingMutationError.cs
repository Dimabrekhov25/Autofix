namespace Autofix.Application.Bookings.Results;

public enum BookingMutationError
{
    None = 0,
    BookingNotFound = 1,
    CustomerNotFound = 2,
    VehicleNotFound = 3,
    VehicleDoesNotBelongToCustomer = 4,
    ServiceCatalogItemsNotFound = 5,
    TimeSlotUnavailable = 6
}
