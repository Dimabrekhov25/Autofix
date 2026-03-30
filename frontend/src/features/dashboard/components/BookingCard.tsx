import type { Booking, BookingStatus } from '../types/booking'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import { cn } from '../../../shared/lib/cn'

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
  const { vehicle } = booking.diagnosticData
  const config = statusConfig[booking.status]
  const issuesCount = booking.diagnosticData.issues.filter((i: { priority: string }) => i.priority !== 'resolved').length

  return (
    <button
      type="button"
      onClick={() => onClick?.(booking.id)}
      className={cn(
        'w-full text-left rounded-xl p-5 transition-all duration-200',
        'border-2 hover:shadow-lg hover:-translate-y-0.5',
        isSelected
          ? 'border-primary bg-primary/5 shadow-panel'
          : 'border-white bg-white hover:border-primary/30'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-headline font-bold text-lg text-on-surface mb-1">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm text-on-surface-variant">
            {vehicle.plateNumber} • {vehicle.trim}
          </p>
        </div>
        <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-full', config.bgColor)}>
          <MaterialIcon name={config.icon} className={cn('text-sm', config.textColor)} />
          <span className={cn('text-[10px] font-bold uppercase tracking-wider', config.textColor)}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <MaterialIcon name="calendar_today" className="text-sm" />
          <span>{booking.scheduledDate} at {booking.scheduledTime}</span>
        </div>
        {booking.estimatedCompletion && (
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <MaterialIcon name="schedule" className="text-sm" />
            <span>Est. completion: {booking.estimatedCompletion}</span>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="flex items-center gap-4 pt-3 border-t border-outline-variant/10">
        {issuesCount > 0 && (
          <div className="flex items-center gap-1.5">
            <MaterialIcon name="warning" className="text-secondary text-sm" />
            <span className="text-xs font-bold text-on-surface">
              {issuesCount} {issuesCount === 1 ? 'Issue' : 'Issues'}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <MaterialIcon name="attach_money" className="text-primary text-sm" />
          <span className="text-xs font-bold text-on-surface">
            ${booking.diagnosticData.costBreakdown.grandTotal.toFixed(0)}
          </span>
        </div>
      </div>
    </button>
  )
}
