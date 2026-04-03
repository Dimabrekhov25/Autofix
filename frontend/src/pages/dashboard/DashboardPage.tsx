import { useEffect, useState } from 'react'

import { getBookingErrorMessage, getMyBookingsRequest } from '../../apis/bookingApi'
import { useAuth } from '../../features/auth/useAuth'
import { BookingDetailsView } from '../../features/dashboard/components/BookingDetailsView'
import { BookingList } from '../../features/dashboard/components/BookingList'
import { getBookingSummary, mapBookingHistory } from '../../features/dashboard/lib/booking-history'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

export function DashboardPage() {
  const { tokens } = useAuth()
  const accessToken = tokens?.accessToken
  const [bookings, setBookings] = useState(() => [] as ReturnType<typeof mapBookingHistory>)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadBookings() {
      if (!accessToken) {
        if (isMounted) {
          setBookings([])
          setSelectedBookingId(null)
          setErrorMessage('Your session is missing an access token.')
          setIsLoading(false)
        }

        return
      }

      setIsLoading(true)
      setErrorMessage(null)

      try {
        const bookingHistory = await getMyBookingsRequest(accessToken)
        const nextBookings = mapBookingHistory(bookingHistory)

        if (!isMounted) {
          return
        }

        setBookings(nextBookings)
        setSelectedBookingId((currentSelectedBookingId) => {
          if (
            currentSelectedBookingId &&
            nextBookings.some((booking) => booking.id === currentSelectedBookingId)
          ) {
            return currentSelectedBookingId
          }

          return nextBookings[0]?.id ?? null
        })
      } catch (error) {
        if (isMounted) {
          setBookings([])
          setSelectedBookingId(null)
          setErrorMessage(getBookingErrorMessage(error, 'Unable to load your booking history.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadBookings()

    return () => {
      isMounted = false
    }
  }, [accessToken])

  const selectedBooking = bookings.find((booking) => booking.id === selectedBookingId) || null
  const summary = getBookingSummary(bookings)

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-headline font-extrabold tracking-tight text-on-background">
          Service Dashboard
        </h1>
        <p className="text-on-surface-variant">
          Review and track your personal vehicle service bookings
        </p>
      </div>

      {errorMessage ? (
        <div className="mb-6 rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
          {errorMessage}
        </div>
      ) : null}

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="shell-panel p-4">
          <div className="mb-2 flex items-center gap-3">
            <MaterialIcon name="event" className="text-2xl text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Total
            </span>
          </div>
          <p className="text-3xl font-headline font-black text-on-surface">{summary.totalBookings}</p>
        </div>

        <div className="shell-panel p-4">
          <div className="mb-2 flex items-center gap-3">
            <MaterialIcon name="build_circle" className="text-2xl text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Active
            </span>
          </div>
          <p className="text-3xl font-headline font-black text-primary">{summary.active}</p>
        </div>

        <div className="shell-panel p-4">
          <div className="mb-2 flex items-center gap-3">
            <MaterialIcon name="event_available" className="text-2xl text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Upcoming
            </span>
          </div>
          <p className="text-3xl font-headline font-black text-blue-600">{summary.upcoming}</p>
        </div>

        <div className="shell-panel p-4">
          <div className="mb-2 flex items-center gap-3">
            <MaterialIcon name="check_circle" className="text-2xl text-green-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Completed
            </span>
          </div>
          <p className="text-3xl font-headline font-black text-green-600">{summary.completed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 xl:col-span-4">
          <h2 className="mb-4 text-xl font-headline font-bold text-on-surface">Booking History</h2>
          {isLoading ? (
            <div className="shell-panel p-8 text-center text-sm text-on-surface-variant">
              Loading your booking history...
            </div>
          ) : (
            <BookingList
              bookings={bookings}
              selectedBookingId={selectedBookingId}
              onSelectBooking={setSelectedBookingId}
            />
          )}
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
          <h2 className="mb-4 text-xl font-headline font-bold text-on-surface">Booking Details</h2>
          {isLoading ? (
            <div className="shell-panel p-8 text-center text-sm text-on-surface-variant">
              Preparing booking details...
            </div>
          ) : (
            <BookingDetailsView booking={selectedBooking} onBack={() => setSelectedBookingId(null)} />
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
