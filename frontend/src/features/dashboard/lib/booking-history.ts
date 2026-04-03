import type { BookingDto } from '../../../apis/bookingApi'

import type { Booking, BookingStatus, BookingSummary } from '../types/booking'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function mapBookingHistory(bookings: BookingDto[], now = new Date()): Booking[] {
  return bookings
    .filter((booking): booking is BookingDto & { vehicle: NonNullable<BookingDto['vehicle']> } => Boolean(booking.vehicle))
    .map((booking) => {
      const status = resolveBookingStatus(booking, now)
      const startAt = new Date(booking.startAt)
      const endAt = new Date(booking.endAt)

      return {
        id: booking.id,
        customerId: booking.customerId,
        vehicleId: booking.vehicleId,
        vehicle: {
          id: booking.vehicle.id,
          make: booking.vehicle.make,
          model: booking.vehicle.model,
          year: booking.vehicle.year,
          trim: booking.vehicle.trim ?? '',
          engine: booking.vehicle.engine ?? '',
          plateNumber: booking.vehicle.licensePlate,
          vin: booking.vehicle.vin ?? '',
          isDrivable: booking.vehicle.isDrivable,
        },
        status,
        scheduledAt: booking.startAt,
        scheduledDate: dateFormatter.format(startAt),
        scheduledTime: timeFormatter.format(startAt),
        endAt: booking.endAt,
        estimatedCompletion: status === 'completed' ? undefined : dateTimeFormatter.format(endAt),
        pricing: booking.pricing,
        paymentOption: booking.paymentOption,
        services: booking.services.map((service) => ({
          id: service.id,
          name: service.name,
          description: service.description,
          estimatedDuration: service.estimatedDuration,
          basePrice: service.basePrice,
          estimatedLaborCost: service.estimatedLaborCost,
        })),
        notes: booking.notes ?? undefined,
        createdAt: booking.startAt,
        updatedAt: booking.endAt,
      }
    })
    .sort((left, right) => Date.parse(right.scheduledAt) - Date.parse(left.scheduledAt))
}

export function getBookingSummary(bookings: Booking[], now = new Date()): BookingSummary {
  return {
    totalBookings: bookings.length,
    active: bookings.filter((booking) => booking.status === 'in-service').length,
    completed: bookings.filter((booking) => booking.status === 'completed').length,
    upcoming: bookings.filter((booking) => {
      if (booking.status === 'cancelled' || booking.status === 'completed') {
        return false
      }

      return Date.parse(booking.scheduledAt) > now.getTime()
    }).length,
  }
}

function resolveBookingStatus(booking: BookingDto, now: Date): BookingStatus {
  const startAt = Date.parse(booking.startAt)
  const endAt = Date.parse(booking.endAt)

  if (booking.status === 3) {
    return 'cancelled'
  }

  if (Number.isFinite(endAt) && endAt < now.getTime()) {
    return 'completed'
  }

  if (Number.isFinite(startAt) && Number.isFinite(endAt) && startAt <= now.getTime() && endAt >= now.getTime()) {
    return 'in-service'
  }

  if (booking.status === 2) {
    return 'confirmed'
  }

  return 'pending'
}
