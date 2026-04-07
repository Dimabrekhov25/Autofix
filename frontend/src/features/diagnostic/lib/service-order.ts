import type { BookingDto } from '../../../apis/bookingApi'
import { formatBookingReference } from '../../booking/lib/booking-api-helpers'

export const serviceOrderStatusOptions = [
  { value: 1 as const, label: 'Pending', description: 'Request created and estimate can still be edited.' },
  { value: 2 as const, label: 'Awaiting Approval', description: 'Estimate is waiting for customer approval.' },
  { value: 7 as const, label: 'Approved', description: 'Customer approved the estimate and the workshop can now start the repair.' },
  { value: 3 as const, label: 'In Progress', description: 'Estimate approved and repair is now in progress.' },
  { value: 4 as const, label: 'Completed', description: 'Repair is completed.' },
  { value: 5 as const, label: 'Cancelled', description: 'Request was cancelled before repair started.' },
  { value: 6 as const, label: 'Estimate Revision', description: 'Estimate was returned to diagnostics for revision.' },
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
    return `${formatBookingReference(booking.id)} | ${booking.vehicle.licensePlate} | ${booking.vehicle.vin ?? 'VIN unavailable'}`
  }

  return formatBookingReference(booking.id)
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
      return 'Pending'
    case 2:
      return 'Awaiting Approval'
    case 7:
      return 'Approved'
    case 3:
      return 'In Progress'
    case 4:
      return 'Completed'
    case 5:
      return 'Cancelled'
    case 6:
      return 'Estimate Revision'
    default:
      return 'Unknown'
  }
}

export function getServiceOrderStatusLabel(status: number) {
  return serviceOrderStatusOptions.find((option) => option.value === status)?.label ?? 'Unknown'
}

export function getBookingPaymentMethodLabel(paymentOption: number) {
  return paymentOption === 1 ? 'Online checkout' : 'Pay at shop'
}

export function getBookingSettlementLabel(booking: BookingDto) {
  switch (booking.status) {
    case 4:
      return booking.paymentOption === 1
        ? 'Online checkout selected'
        : 'Collect payment at pickup'
    case 7:
      return 'Approved, waiting for repair start'
    case 3:
      return 'Repair in progress, settlement pending'
    case 2:
      return 'Estimate not approved yet'
    default:
      return 'Settlement not ready yet'
  }
}
