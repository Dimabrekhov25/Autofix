import {
  bookingCalendarDays,
  bookingCalendarLeadingEmptyDays,
  bookingCalendarWeekdays,
  bookingDefaults,
} from '../constants/booking-content'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface BookingCalendarPanelProps {
  selectedDate: number
  onSelectDate: (date: number) => void
}

export function BookingCalendarPanel({
  selectedDate,
  onSelectDate,
}: BookingCalendarPanelProps) {
  return (
    <div className="bg-surface-container-low/30 p-8 md:col-span-7">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">{bookingDefaults.monthLabel}</h2>
          <p className="text-sm text-on-surface-variant">{bookingDefaults.monthDescription}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg p-2 transition-colors hover:bg-surface-container"
          >
            <MaterialIcon name="chevron_left" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 transition-colors hover:bg-surface-container"
          >
            <MaterialIcon name="chevron_right" />
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-7 gap-1 text-center">
        {bookingCalendarWeekdays.map((day) => (
          <div
            key={day}
            className="py-2 text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: bookingCalendarLeadingEmptyDays }).map((_, index) => (
          <div key={`empty-${index}`} className="p-4" />
        ))}

        {bookingCalendarDays.map((day) => {
          if (!day.available) {
            return (
              <button
                key={day.value}
                type="button"
                disabled
                className="cursor-not-allowed rounded-xl p-4 text-sm font-medium text-on-surface-variant/40"
              >
                {day.value}
              </button>
            )
          }

          const isSelected = day.value === selectedDate

          return (
            <button
              key={day.value}
              type="button"
              onClick={() => onSelectDate(day.value)}
              className={[
                'rounded-xl p-4 text-sm font-medium transition-all',
                isSelected
                  ? 'bg-primary text-on-primary ring-4 ring-primary-container/30 shadow-lg'
                  : 'text-on-surface hover:bg-surface-container',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {day.value}
            </button>
          )
        })}
      </div>

      <div className="relative mt-12 flex items-center gap-6 overflow-hidden rounded-xl bg-surface-container p-6">
        <div className="z-10">
          <h3 className="mb-1 font-bold text-primary">Peak Performance Guarantee</h3>
          <p className="max-w-[240px] text-xs leading-relaxed text-on-surface-variant">
            Appointments scheduled before 10 AM qualify for same-day completion for standard
            maintenance.
          </p>
        </div>
        <MaterialIcon
          name="engineering"
          className="absolute -bottom-4 -right-4 rotate-12 text-8xl text-primary opacity-10"
        />
      </div>
    </div>
  )
}
