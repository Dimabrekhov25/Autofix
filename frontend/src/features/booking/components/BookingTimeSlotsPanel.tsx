import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import type { BookingAvailableSlotDto } from '../../../apis/bookingApi'

interface BookingTimeSlotsPanelProps {
  selectedSlotId: string
  slots: BookingAvailableSlotDto[]
  isLoading?: boolean
  errorMessage?: string | null
  onSelectSlot: (slotId: string) => void
  onBack?: () => void
  onContinue?: () => void
  canContinue?: boolean
}

export function BookingTimeSlotsPanel({
  selectedSlotId,
  slots,
  isLoading = false,
  errorMessage,
  onSelectSlot,
  onBack,
  onContinue,
  canContinue = true,
}: BookingTimeSlotsPanelProps) {
  const availableSlots = slots.filter((slot) => slot.isAvailable)
  const morningSlots = availableSlots.filter((slot) => {
    const hours = new Date(slot.startAt).getHours()
    return hours < 12
  })
  const afternoonSlots = availableSlots.filter((slot) => {
    const hours = new Date(slot.startAt).getHours()
    return hours >= 12
  })

  const renderSlot = (slot: BookingAvailableSlotDto) => {
    const slotId = slot.id
    const label = slot.label
    const isSelected = slotId === selectedSlotId

    return (
      <button
        key={slotId}
        type="button"
        onClick={() => onSelectSlot(slotId)}
        className={[
          'group flex w-full items-center justify-between rounded-xl p-4 transition-all',
          isSelected
            ? 'bg-primary text-on-primary shadow-md'
            : 'bg-surface-container-low hover:bg-surface-container',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className={isSelected ? 'font-bold' : 'font-bold text-on-surface'}>{label}</span>
        {isSelected ? (
          <MaterialIcon name="check_circle" className="text-sm" />
        ) : (
          <span className="text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Select
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="border-outline-variant/10 p-8 md:col-span-5 md:border-l">
      <h3 className="mb-6 text-xl font-bold text-on-surface">Available Slots</h3>

      {errorMessage ? (
        <div className="mb-5 rounded-xl border border-error/15 bg-error/5 px-4 py-3 text-sm text-error">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-xl bg-surface-container-low p-5 text-sm font-medium text-on-surface-variant">
          Loading schedule...
        </div>
      ) : availableSlots.length === 0 ? (
        <div className="rounded-xl bg-surface-container-low p-5 text-sm font-medium text-on-surface-variant">
          No slots available for the selected date.
        </div>
      ) : (
        <div className="space-y-3">
        <div className="mb-2 flex items-center gap-4 px-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          <MaterialIcon name="wb_sunny" className="text-sm" />
          Morning
        </div>
        {morningSlots.length > 0 ? (
          morningSlots.map((slot) => renderSlot(slot))
        ) : (
          <div className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
            No morning slots
          </div>
        )}

        <div className="mb-2 pt-6 flex items-center gap-4 px-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          <MaterialIcon name="light_mode" className="text-sm" />
          Afternoon
        </div>
        {afternoonSlots.length > 0 ? (
          afternoonSlots.map((slot) => renderSlot(slot))
        ) : (
          <div className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
            No afternoon slots
          </div>
        )}
      </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-12">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 font-bold text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <MaterialIcon name="arrow_back" className="text-sm" />
          Back
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          Continue
          <MaterialIcon name="arrow_forward" className="text-sm" />
        </button>
      </div>
    </div>
  )
}
