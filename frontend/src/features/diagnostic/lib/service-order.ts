import type { BookingDto } from '../../../apis/bookingApi'

export const serviceOrderStatusOptions = [
  { value: 1 as const, label: 'Created', description: 'Booking created, not yet diagnosed.' },
  { value: 2 as const, label: 'In Diagnosis', description: 'Mechanic is inspecting the vehicle.' },
  { value: 3 as const, label: 'Waiting Approval', description: 'Waiting for customer approval.' },
  { value: 4 as const, label: 'Approved In Repair', description: 'Repair approved and in progress.' },
  { value: 5 as const, label: 'Ready For Pickup', description: 'Vehicle is ready for pickup.' },
  { value: 6 as const, label: 'Completed', description: 'Repair is completed and stock is consumed.' },
] as const

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatBookingDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function getBookingCardTitle(booking: BookingDto) {
  if (booking.vehicle) {
    return `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`.trim()
  }

  return `Booking ${booking.id.slice(0, 8)}`
}

export function getBookingCardSubtitle(booking: BookingDto) {
  if (booking.vehicle) {
    return `${booking.vehicle.licensePlate} · ${booking.vehicle.vin ?? 'VIN unavailable'}`
  }

  return booking.id
}

export function getBookingServicesLabel(booking: BookingDto) {
  if (booking.services.length === 0) {
    return 'No booked services'
  }

  if (booking.services.length === 1) {
    return booking.services[0].name
  }

  return `${booking.services[0].name} +${booking.services.length - 1} more`
}

export function isDiagnosticOnlyBooking(booking: BookingDto) {
  return booking.services.length > 0 && booking.services.every((service) => service.category === 1)
}

export function getBookingStatusLabel(status: number) {
  switch (status) {
    case 1:
      return 'Created'
    case 2:
      return 'Confirmed'
    case 3:
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}

export function getServiceOrderStatusLabel(status: number) {
  return serviceOrderStatusOptions.find((option) => option.value === status)?.label ?? 'Unknown'
}
