import {
  bookingDefaults,
  bookingSummaryBase,
  bookingTimeSlots,
} from '../constants/booking-content'
import type { BookingSummaryCard } from '../types/booking'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface BookingSelectionSummaryProps {
  selectedDate: number
  selectedSlotId: string
}

export function BookingSelectionSummary({
  selectedDate,
  selectedSlotId,
}: BookingSelectionSummaryProps) {
  const selectedSlot = bookingTimeSlots.find((slot) => slot.id === selectedSlotId)

  const cards: BookingSummaryCard[] = bookingSummaryBase.map((card) => {
    if (card.id === 'service') {
      return {
        ...card,
        value: bookingDefaults.selectedService,
      }
    }

    if (card.id === 'date-time') {
      return {
        ...card,
        value: `Sep ${selectedDate}, ${selectedSlot?.label ?? '09:15 AM'}`,
        emphasized: true,
      }
    }

    if (card.id === 'vehicle') {
      return {
        ...card,
        value: bookingDefaults.selectedVehicle,
      }
    }

    return {
      ...card,
      value: bookingDefaults.pendingEstimate,
      pending: true,
    }
  })

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className={[
            'flex items-center gap-4 rounded-xl p-4',
            card.emphasized
              ? 'border border-primary/20 bg-white shadow-sm'
              : card.pending
                ? 'border border-dashed border-outline-variant/30 bg-surface-container-low'
                : 'border border-outline-variant/10 bg-surface-container-highest/40',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div
            className={[
              'flex h-10 w-10 items-center justify-center rounded-lg',
              card.emphasized
                ? 'bg-primary text-on-primary'
                : card.pending
                  ? 'bg-surface-variant text-on-surface-variant'
                  : 'bg-primary-container text-primary',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <MaterialIcon name={card.icon} />
          </div>

          <div>
            <p
              className={[
                'text-[10px] font-bold uppercase tracking-widest',
                card.emphasized ? 'text-primary' : 'text-on-surface-variant',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {card.label}
            </p>
            <p
              className={[
                'text-sm',
                card.pending ? 'italic text-on-surface-variant' : 'font-bold text-on-surface',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
