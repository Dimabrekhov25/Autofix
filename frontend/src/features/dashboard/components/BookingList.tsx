import { useTranslation } from 'react-i18next'

import type { Booking } from '../types/booking'
import { BookingCard } from './BookingCard'

interface BookingListProps {
  bookings: Booking[]
  selectedBookingId?: string | null
  onSelectBooking: (bookingId: string) => void
}

export function BookingList({ bookings, selectedBookingId, onSelectBooking }: BookingListProps) {
  const { t } = useTranslation()

  if (bookings.length === 0) {
    return (
      <div className="shell-panel p-12 text-center">
        <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-surface-container flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-40">
            event_busy
          </span>
        </div>
        <h3 className="font-headline font-bold text-lg text-on-surface mb-2">{t('app.bookingDetails.noBookingsYet')}</h3>
        <p className="text-sm text-on-surface-variant">
          {t('app.bookingDetails.noBookingsDescription')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          isSelected={booking.id === selectedBookingId}
          onClick={onSelectBooking}
        />
      ))}
    </div>
  )
}
