import type { TFunction } from 'i18next'
import type { BookingDto } from '../../../apis/bookingApi'
import { formatBookingReference } from '../../booking/lib/booking-api-helpers'

type Translate = TFunction<'translation', undefined>

export const serviceOrderStatusOptions = [
  { value: 1 as const, label: 'Pending', description: 'Request created and estimate can still be edited.' },
  { value: 2 as const, label: 'Awaiting Approval', description: 'Estimate is waiting for customer approval.' },
  { value: 7 as const, label: 'Approved', description: 'Customer approved the estimate and the workshop can now start the repair.' },
  { value: 3 as const, label: 'In Progress', description: 'Estimate approved and repair is now in progress.' },
  { value: 4 as const, label: 'Completed', description: 'Repair is completed.' },
  { value: 5 as const, label: 'Cancelled', description: 'Request was cancelled before repair started.' },
  { value: 6 as const, label: 'Estimate Revision', description: 'Estimate was returned to diagnostics for revision.' },
] as const

export function formatCurrency(value: number, locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatBookingDate(value: string, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, {
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

export function getBookingCardSubtitle(booking: BookingDto, t?: Translate) {
  if (booking.vehicle) {
    return `${formatBookingReference(booking.id)} | ${booking.vehicle.licensePlate} | ${booking.vehicle.vin ?? t?.('app.serviceOrder.vinUnavailable') ?? 'VIN unavailable'}`
  }

  return formatBookingReference(booking.id)
}

export function getBookingServicesLabel(booking: BookingDto, t?: Translate) {
  if (booking.services.length === 0) {
    return t?.('app.serviceOrder.noBookedServices') ?? 'No booked services'
  }

  if (booking.services.length === 1) {
    return booking.services[0].name
  }

  return `${booking.services[0].name} ${t?.('app.serviceOrder.moreServices', { count: booking.services.length - 1 }) ?? `+${booking.services.length - 1} more`}`
}

export function isDiagnosticOnlyBooking(booking: BookingDto) {
  return booking.services.length > 0 && booking.services.every((service) => service.category === 1)
}

export function getBookingStatusLabel(status: number, t?: Translate) {
  switch (status) {
    case 1:
      return t?.('app.status.pending') ?? 'Pending'
    case 2:
      return t?.('app.status.awaitingApproval') ?? 'Awaiting Approval'
    case 7:
      return t?.('app.status.approved') ?? 'Approved'
    case 3:
      return t?.('app.status.inProgress') ?? 'In Progress'
    case 4:
      return t?.('app.status.completed') ?? 'Completed'
    case 5:
      return t?.('app.status.cancelled') ?? 'Cancelled'
    case 6:
      return t?.('app.status.estimateRevision') ?? 'Estimate Revision'
    default:
      return t?.('app.status.unknown') ?? 'Unknown'
  }
}

export function getServiceOrderStatusLabel(status: number, t?: Translate) {
  return getBookingStatusLabel(status, t)
}

export function getBookingPaymentMethodLabel(paymentOption: number, t?: Translate) {
  return paymentOption === 1
    ? t?.('app.serviceOrder.onlineCheckout') ?? 'Online checkout'
    : t?.('app.serviceOrder.payAtShop') ?? 'Pay at shop'
}

export function getBookingSettlementLabel(booking: BookingDto, t?: Translate) {
  switch (booking.status) {
    case 4:
      return booking.paymentOption === 1
        ? t?.('app.serviceOrder.onlineCheckoutSelected') ?? 'Online checkout selected'
        : t?.('app.serviceOrder.collectPaymentAtPickup') ?? 'Collect payment at pickup'
    case 7:
      return t?.('app.serviceOrder.approvedWaitingRepair') ?? 'Approved, waiting for repair start'
    case 3:
      return t?.('app.serviceOrder.repairInProgressSettlementPending') ?? 'Repair in progress, settlement pending'
    case 2:
      return t?.('app.serviceOrder.estimateNotApprovedYet') ?? 'Estimate not approved yet'
    default:
      return t?.('app.serviceOrder.settlementNotReady') ?? 'Settlement not ready yet'
  }
}
