import type { Booking, BookingStatus } from '../types/booking'
import { formatBookingCurrency } from '../../booking/lib/booking-api-helpers'
import { cn } from '../../../shared/lib/cn'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface BookingCardProps {
  booking: Booking
  isSelected?: boolean
  onClick?: (bookingId: string) => void
}

const statusConfig: Record<
  BookingStatus,
  {
    label: string
    bgColor: string
    textColor: string
    icon: string
  }
> = {
  'in-service': {
    label: 'In Service',
    bgColor: 'bg-primary/10',
    textColor: 'text-primary',
    icon: 'build_circle',
  },
  completed: {
    label: 'Completed',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-700',
    icon: 'check_circle',
  },
  confirmed: {
    label: 'Confirmed',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-700',
    icon: 'event_available',
  },
  pending: {
    label: 'Pending',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-700',
    icon: 'schedule',
  },
  cancelled: {
    label: 'Cancelled',
    bgColor: 'bg-error/10',
    textColor: 'text-error',
    icon: 'cancel',
  },
}

export function BookingCard({ booking, isSelected = false, onClick }: BookingCardProps) {
  const config = statusConfig[booking.status]
  const servicesCount = booking.services.length
  const secondaryLine = [booking.vehicle.plateNumber, booking.vehicle.trim].filter(Boolean).join(' | ')

  return (
    <button
      type="button"
      onClick={() => onClick?.(booking.id)}
      className={cn(
        'w-full rounded-xl p-5 text-left transition-all duration-200',
        'border-2 hover:-translate-y-0.5 hover:shadow-lg',
        isSelected
          ? 'border-primary bg-primary/5 shadow-panel'
          : 'border-white bg-white hover:border-primary/30',
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1 font-headline text-lg font-bold text-on-surface">
            {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
          </h3>
          <p className="text-sm text-on-surface-variant">
            {secondaryLine || 'Vehicle information'}
          </p>
        </div>
        <div className={cn('flex items-center gap-1.5 rounded-full px-2 py-1', config.bgColor)}>
          <MaterialIcon name={config.icon} className={cn('text-sm', config.textColor)} />
          <span className={cn('text-[10px] font-bold uppercase tracking-wider', config.textColor)}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <MaterialIcon name="calendar_today" className="text-sm" />
          <span>{booking.scheduledDate} at {booking.scheduledTime}</span>
        </div>
        {booking.estimatedCompletion ? (
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <MaterialIcon name="schedule" className="text-sm" />
            <span>Ends: {booking.estimatedCompletion}</span>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-4 border-t border-outline-variant/10 pt-3">
        <div className="flex items-center gap-1.5">
          <MaterialIcon name="build" className="text-secondary text-sm" />
          <span className="text-xs font-bold text-on-surface">
            {servicesCount} {servicesCount === 1 ? 'Service' : 'Services'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <MaterialIcon name="attach_money" className="text-primary text-sm" />
          <span className="text-xs font-bold text-on-surface">
            {formatBookingCurrency(booking.pricing.totalEstimate, booking.pricing.currency)}
          </span>
        </div>
      </div>
    </button>
  )
}
