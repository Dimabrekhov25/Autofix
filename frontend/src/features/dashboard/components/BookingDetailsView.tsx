import type { Booking } from '../types/booking'
import { formatBookingCurrency, formatBookingDuration } from '../../booking/lib/booking-api-helpers'
import { VehicleInfoCard } from '../../diagnostic/components/VehicleInfoCard'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface BookingDetailsViewProps {
  booking: Booking | null
  onBack?: () => void
}

export function BookingDetailsView({ booking, onBack }: BookingDetailsViewProps) {
  if (!booking) {
    return (
      <div className="shell-panel p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container">
          <MaterialIcon name="touch_app" className="text-4xl text-on-surface-variant opacity-40" />
        </div>
        <h3 className="mb-2 font-headline text-lg font-bold text-on-surface">Select a Booking</h3>
        <p className="text-sm text-on-surface-variant">
          Click on a booking card to view the scheduled vehicle, services, and estimate.
        </p>
      </div>
    )
  }

  const scheduledWindow = `${booking.scheduledDate} at ${booking.scheduledTime}`
  const vehicleDetails = [booking.vehicle.trim, booking.vehicle.engine].filter(Boolean).join(' / ')

  return (
    <div className="space-y-8">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-primary lg:hidden"
        >
          <MaterialIcon name="arrow_back" className="text-lg" />
          <span>Back to Bookings</span>
        </button>
      ) : null}

      <div className="space-y-2">
        <span className="text-[0.6875rem] font-label font-bold uppercase tracking-[0.1em] text-primary">
          Booking Overview
        </span>
        <h1 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface">
          {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
        </h1>
        <p className="font-medium text-on-surface-variant">
          {vehicleDetails || 'Vehicle details'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <VehicleInfoCard label="Scheduled" value={scheduledWindow} />
        <VehicleInfoCard label="Plate Number" value={booking.vehicle.plateNumber || 'Not provided'} />
        <VehicleInfoCard label="VIN Number" value={booking.vehicle.vin || 'Not provided'} mono />
        <VehicleInfoCard
          label="Driveability"
          value={booking.vehicle.isDrivable ? 'Vehicle can be driven in' : 'Tow support recommended'}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-headline font-bold text-on-surface">Booked Services</h2>
          <span className="text-sm font-bold text-secondary">
            {booking.services.length} selected
          </span>
        </div>

        {booking.services.length === 0 ? (
          <div className="shell-panel p-8 text-center">
            <MaterialIcon name="build_circle" className="mb-3 text-5xl text-primary opacity-40" />
            <p className="text-sm font-medium text-on-surface-variant">
              No service items were attached to this booking.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {booking.services.map((service) => (
              <div key={service.id} className="shell-panel p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-headline text-lg font-bold text-on-surface">{service.name}</h3>
                    <p className="mt-1 text-sm text-on-surface-variant">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-on-surface">
                      {formatBookingCurrency(
                        service.basePrice + service.estimatedLaborCost,
                        booking.pricing.currency,
                      )}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {formatBookingDuration(service.estimatedDuration)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="shell-panel p-6">
        <h3 className="mb-4 font-headline text-sm font-bold uppercase tracking-wider text-on-surface-variant">
          Estimate Summary
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant">Subtotal</span>
            <span className="font-bold text-on-surface">
              {formatBookingCurrency(booking.pricing.subtotal, booking.pricing.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant">Estimated labor</span>
            <span className="font-bold text-on-surface">
              {formatBookingCurrency(booking.pricing.estimatedLaborCost, booking.pricing.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant">Tax</span>
            <span className="font-bold text-on-surface">
              {formatBookingCurrency(booking.pricing.taxAmount, booking.pricing.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-outline-variant/10 pt-3">
            <span className="font-headline text-base font-bold text-on-surface">Total</span>
            <span className="font-headline text-xl font-extrabold text-on-surface">
              {formatBookingCurrency(booking.pricing.totalEstimate, booking.pricing.currency)}
            </span>
          </div>
        </div>
      </div>

      {booking.notes ? (
        <div className="shell-panel p-6">
          <h3 className="mb-3 font-headline text-sm font-bold uppercase tracking-wider text-on-surface-variant">
            Booking Notes
          </h3>
          <p className="text-sm text-on-surface">{booking.notes}</p>
        </div>
      ) : null}
    </div>
  )
}
