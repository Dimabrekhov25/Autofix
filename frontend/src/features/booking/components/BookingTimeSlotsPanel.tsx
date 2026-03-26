import { bookingTimeSlots } from '../constants/booking-content'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface BookingTimeSlotsPanelProps {
  selectedSlotId: string
  onSelectSlot: (slotId: string) => void
}

export function BookingTimeSlotsPanel({
  selectedSlotId,
  onSelectSlot,
}: BookingTimeSlotsPanelProps) {
  const morningSlots = bookingTimeSlots.filter((slot) => slot.period === 'morning')
  const afternoonSlots = bookingTimeSlots.filter((slot) => slot.period === 'afternoon')

  const renderSlot = (slotId: string, label: string, available: boolean) => {
    const isSelected = slotId === selectedSlotId

    if (!available) {
      return (
        <button
          key={slotId}
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-between rounded-xl bg-surface-container-low p-4 opacity-50"
        >
          <span className="font-bold text-on-surface">{label}</span>
          <span className="rounded bg-surface-variant px-2 py-1 text-[10px] font-bold text-on-surface-variant">
            FULL
          </span>
        </button>
      )
    }

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

      <div className="space-y-3">
        <div className="mb-2 flex items-center gap-4 px-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          <MaterialIcon name="wb_sunny" className="text-sm" />
          Morning
        </div>
        {morningSlots.map((slot) => renderSlot(slot.id, slot.label, slot.available))}

        <div className="mb-2 pt-6 flex items-center gap-4 px-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          <MaterialIcon name="light_mode" className="text-sm" />
          Afternoon
        </div>
        {afternoonSlots.map((slot) => renderSlot(slot.id, slot.label, slot.available))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-12">
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-3 font-bold text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <MaterialIcon name="arrow_back" className="text-sm" />
          Back
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          Continue
          <MaterialIcon name="arrow_forward" className="text-sm" />
        </button>
      </div>
    </div>
  )
}
