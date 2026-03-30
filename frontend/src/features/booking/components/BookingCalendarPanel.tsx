import {
  bookingCalendarWeekdays,
  bookingDefaults,
} from '../constants/booking-content'
import {
  clampBookingDay,
  formatBookingMonthLabel,
  getFirstAvailableBookingDay,
  getBookingMonthDayCount,
  isBookingDateAvailable,
  parseBookingMonthKey,
  shiftBookingMonth,
} from '../lib/booking-date'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface BookingCalendarPanelProps {
  selectedMonthKey: string
  selectedDate: number
  onSelectDate: (date: number) => void
  onSelectMonthKey: (monthKey: string, suggestedDay: number) => void
}

export function BookingCalendarPanel({
  selectedMonthKey,
  selectedDate,
  onSelectDate,
  onSelectMonthKey,
}: BookingCalendarPanelProps) {
  const monthLabel = formatBookingMonthLabel(selectedMonthKey)
  const { year, monthIndex } = parseBookingMonthKey(selectedMonthKey)
  const firstDay = new Date(year, monthIndex, 1)
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7
  const daysInMonth = getBookingMonthDayCount(selectedMonthKey)
  const trailingEmptyDays = (7 - ((leadingEmptyDays + daysInMonth) % 7 || 7)) % 7
  const previousMonthKey = shiftBookingMonth(selectedMonthKey, -1)
  const nextMonthKey = shiftBookingMonth(selectedMonthKey, 1)

  return (
    <div className="bg-surface-container-low/30 p-8 md:col-span-7">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">{monthLabel}</h2>
          <p className="text-sm text-on-surface-variant">{bookingDefaults.monthDescription}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              onSelectMonthKey(
                previousMonthKey,
                isBookingDateAvailable(previousMonthKey, clampBookingDay(previousMonthKey, selectedDate))
                  ? clampBookingDay(previousMonthKey, selectedDate)
                  : getFirstAvailableBookingDay(previousMonthKey, clampBookingDay(previousMonthKey, selectedDate))
              )
            }
            className="rounded-lg p-2 transition-colors hover:bg-surface-container"
          >
            <MaterialIcon name="chevron_left" />
          </button>
          <button
            type="button"
            onClick={() =>
              onSelectMonthKey(
                nextMonthKey,
                isBookingDateAvailable(nextMonthKey, clampBookingDay(nextMonthKey, selectedDate))
                  ? clampBookingDay(nextMonthKey, selectedDate)
                  : getFirstAvailableBookingDay(nextMonthKey, clampBookingDay(nextMonthKey, selectedDate))
              )
            }
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

        {Array.from({ length: leadingEmptyDays }).map((_, index) => (
          <div key={`empty-${index}`} className="p-4" />
        ))}

        {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((dayValue) => {
          if (!isBookingDateAvailable(selectedMonthKey, dayValue)) {
            return (
              <button
                key={dayValue}
                type="button"
                disabled
                className="cursor-not-allowed rounded-xl p-4 text-sm font-medium text-on-surface-variant/40"
              >
                {dayValue}
              </button>
            )
          }

          const isSelected = dayValue === selectedDate

          return (
            <button
              key={dayValue}
              type="button"
              onClick={() => onSelectDate(dayValue)}
              className={[
                'rounded-xl p-4 text-sm font-medium transition-all',
                isSelected
                  ? 'bg-primary text-on-primary ring-4 ring-primary-container/30 shadow-lg'
                  : 'text-on-surface hover:bg-surface-container',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {dayValue}
            </button>
          )
        })}

        {Array.from({ length: trailingEmptyDays }).map((_, index) => (
          <div key={`trailing-empty-${index}`} className="p-4" />
        ))}
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
