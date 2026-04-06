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
    .map((booking) => {
      const status = resolveBookingStatus(booking, now)
      const startAt = new Date(booking.startAt)
      const endAt = new Date(booking.endAt)
      const vehicle = booking.vehicle
      const vehicleTitleFromServices = booking.services[0]?.name ?? 'Service request'

      return {
        id: booking.id,
        customerId: booking.customerId,
        vehicleId: booking.vehicleId,
        vehicle: {
          id: vehicle?.id ?? booking.vehicleId,
          make: vehicle?.make ?? vehicleTitleFromServices,
          model: vehicle?.model ?? 'Vehicle pending',
          year: vehicle?.year ?? 0,
          trim: vehicle?.trim ?? '',
          engine: vehicle?.engine ?? '',
          plateNumber: vehicle?.licensePlate ?? 'Pending',
          vin: vehicle?.vin ?? '',
          isDrivable: vehicle?.isDrivable ?? true,
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
        estimate: booking.estimate
          ? {
              serviceOrderId: booking.estimate.serviceOrderId,
              status: booking.estimate.status,
              estimatedLaborCost: booking.estimate.estimatedLaborCost,
              estimatedPartsCost: booking.estimate.estimatedPartsCost,
              estimatedTotalCost: booking.estimate.estimatedTotalCost,
              workItems: booking.estimate.workItems.map((item) => ({
                id: item.id,
                description: item.description,
                laborHours: item.laborHours,
                hourlyRate: item.hourlyRate,
                lineTotal: item.lineTotal,
              })),
              partItems: booking.estimate.partItems.map((item) => ({
                id: item.id,
                partId: item.partId,
                partName: item.partName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                availability: item.availability,
                lineTotal: item.lineTotal,
              })),
            }
          : undefined,
        notes: booking.notes ?? undefined,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt ?? booking.createdAt,
      }
    })
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
}

export function getBookingSummary(bookings: Booking[], now = new Date()): BookingSummary {
  return {
    totalBookings: bookings.length,
    active: bookings.filter((booking) =>
      booking.status === 'awaiting-approval'
      || booking.status === 'approved'
      || booking.status === 'in-progress'
      || booking.status === 'changes-requested').length,
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
  const endAt = Date.parse(booking.endAt)

  if (booking.status === 5) {
    return 'cancelled'
  }

  if (booking.status === 6) {
    return 'changes-requested'
  }

  if (booking.status === 2) {
    return 'awaiting-approval'
  }

  if (booking.status === 7) {
    return 'approved'
  }

  if (booking.status === 3) {
    return 'in-progress'
  }

  if (booking.status === 4 || (Number.isFinite(endAt) && endAt < now.getTime())) {
    return 'completed'
  }

  return 'pending'
}
