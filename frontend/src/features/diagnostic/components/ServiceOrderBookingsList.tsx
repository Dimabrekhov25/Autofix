import type { BookingDto } from '../../../apis/bookingApi'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import {
  formatBookingDate,
  getBookingCardSubtitle,
  getBookingCardTitle,
  getBookingServicesLabel,
  getBookingStatusLabel,
  isDiagnosticOnlyBooking,
} from '../lib/service-order'

interface ServiceOrderBookingsListProps {
  bookings: BookingDto[]
  isLoading: boolean
  errorMessage: string | null
  selectedBookingId: string | null
  searchValue: string
  onSearchChange: (value: string) => void
  onBookingSelect: (booking: BookingDto) => void
}

export function ServiceOrderBookingsList({
  bookings,
  isLoading,
  errorMessage,
  selectedBookingId,
  searchValue,
  onSearchChange,
  onBookingSelect,
}: ServiceOrderBookingsListProps) {
  const sections = [
    {
      key: 'needs-estimate',
      title: 'Needs Estimate',
      description: 'Fresh arrivals and requests returned for changes.',
      bookings: bookings.filter((booking) => booking.status === 1 || booking.status === 6),
    },
    {
      key: 'cancelled',
      title: 'Cancelled',
      description: 'Cancelled requests kept for reference.',
      bookings: bookings.filter((booking) => booking.status === 5),
    },
  ].filter((section) => section.bookings.length > 0)

  return (
    <section className="rounded-[1.75rem] border border-white/70 bg-white/90 shadow-panel">
      <div className="border-b border-slate-100 p-6">
        <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
          Estimate Queue
        </p>
        <h2 className="mt-2 font-headline text-2xl font-extrabold tracking-tight text-slate-900">
          Select a customer request
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Review the request, inspect the vehicle, prepare the estimate, and send it to the customer.
        </p>
        <div className="relative mt-5">
          <MaterialIcon
            name="search"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by plate, VIN, vehicle, or service..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        </div>
      </div>

      <div className="h-[calc(100vh-11rem)] overflow-y-auto overflow-x-hidden p-4 pr-3">
        {isLoading ? (
          <div className="rounded-2xl bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
            Loading requests...
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
            {errorMessage}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
            No bookings matched this view.
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.key}>
                <div className="mb-3 px-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">
                      {section.title}
                    </h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-600">
                      {section.bookings.length}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{section.description}</p>
                </div>

                <div className="space-y-3">
                  {section.bookings.map((booking) => {
                    const isSelected = booking.id === selectedBookingId
                    const isDiagnosticOnly = isDiagnosticOnlyBooking(booking)

                    return (
                      <button
                        key={booking.id}
                        type="button"
                        onClick={() => onBookingSelect(booking)}
                        className={[
                          'w-full rounded-[1.5rem] border p-5 text-left transition-all',
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-primary/25 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-base font-bold text-slate-900">{getBookingCardTitle(booking)}</p>
                            <p className="mt-1 text-sm text-slate-500">{getBookingCardSubtitle(booking)}</p>
                          </div>
                          <span
                            className={[
                              'inline-flex rounded-full px-3 py-1 text-[0.6875rem] font-black uppercase tracking-[0.18em]',
                              isDiagnosticOnly
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-cyan-100 text-cyan-700',
                            ].join(' ')}
                          >
                            {isDiagnosticOnly ? 'Diagnostic' : 'Service'}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-slate-600">
                          <p>
                            <span className="font-semibold text-slate-900">Booked:</span>{' '}
                            {getBookingServicesLabel(booking)}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-900">Slot:</span>{' '}
                            {formatBookingDate(booking.startAt)}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-900">Booking status:</span>{' '}
                            {getBookingStatusLabel(booking.status)}
                          </p>
                        </div>

                        <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                          {booking.notes?.trim()
                            ? booking.notes
                            : 'No extra complaint was written. Use the booked service and the inspection results to prepare the estimate.'}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
