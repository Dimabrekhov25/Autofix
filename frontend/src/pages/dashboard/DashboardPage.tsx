import { useEffect, useState } from 'react'

import {
  approveBookingEstimateRequest,
  getBookingErrorMessage,
  getMyBookingsRequest,
  requestBookingChangesRequest,
  updateBookingPaymentOptionRequest,
} from '../../apis/bookingApi'
import { useAuth } from '../../features/auth/useAuth'
import { formatBookingReference } from '../../features/booking/lib/booking-api-helpers'
import { BookingDetailsView } from '../../features/dashboard/components/BookingDetailsView'
import { BookingList } from '../../features/dashboard/components/BookingList'
import { getBookingSummary, mapBookingHistory } from '../../features/dashboard/lib/booking-history'
import { Button } from '../../shared/ui/Button'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

const approvalNotificationsRefreshEvent = 'autofix:refresh-approval-notifications'

export function DashboardPage() {
  const { tokens } = useAuth()
  const accessToken = tokens?.accessToken
  const [bookings, setBookings] = useState(() => [] as ReturnType<typeof mapBookingHistory>)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  async function loadBookings(options?: { background?: boolean }) {
    const isBackgroundRefresh = options?.background ?? false

    if (!accessToken) {
      setBookings([])
      setSelectedBookingId(null)
      setErrorMessage('Your session is missing an access token.')
      setIsLoading(false)
      setIsRefreshing(false)
      return
    }

    if (isBackgroundRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }

    setErrorMessage(null)
    setActionErrorMessage(null)

    try {
      const bookingHistory = await getMyBookingsRequest(accessToken)
      const nextBookings = mapBookingHistory(bookingHistory)

      setBookings(nextBookings)
      setSelectedBookingId((currentSelectedBookingId) => {
        if (
          currentSelectedBookingId &&
          nextBookings.some((booking) => booking.id === currentSelectedBookingId)
        ) {
          return currentSelectedBookingId
        }

        return nextBookings.find((booking) => booking.status === 'awaiting-approval')?.id
          ?? nextBookings.find((booking) => booking.status === 'approved')?.id
          ?? nextBookings[0]?.id
          ?? null
      })
    } catch (error) {
      setBookings([])
      setSelectedBookingId(null)
      setErrorMessage(getBookingErrorMessage(error, 'Unable to load your booking history.'))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    void loadBookings()
  }, [accessToken])

  const selectedBooking = bookings.find((booking) => booking.id === selectedBookingId) || null
  const summary = getBookingSummary(bookings)
  const bookingsAwaitingApproval = bookings.filter((booking) => booking.status === 'awaiting-approval')
  const bookingsApproved = bookings.filter((booking) => booking.status === 'approved')
  const bookingsInIntake = bookings.filter((booking) =>
    booking.status === 'pending' || booking.status === 'changes-requested')
  const bookingsInProgress = bookings.filter((booking) => booking.status === 'in-progress')
  const bookingsCompleted = bookings.filter((booking) => booking.status === 'completed')

  const upsertBooking = (nextBooking: Parameters<typeof mapBookingHistory>[0][number]) => {
    const nextMappedBooking = mapBookingHistory([nextBooking])[0]
    if (!nextMappedBooking) {
      return
    }

    setBookings((currentBookings) => {
      const filteredBookings = currentBookings.filter((booking) => booking.id !== nextMappedBooking.id)
      return [nextMappedBooking, ...filteredBookings]
        .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    })
    setSelectedBookingId(nextMappedBooking.id)
  }

  const runBookingAction = async (action: () => Promise<Parameters<typeof mapBookingHistory>[0][number]>) => {
    setIsActionLoading(true)
    setActionErrorMessage(null)

    try {
      const nextBooking = await action()
      upsertBooking(nextBooking)
    } catch (error) {
      setActionErrorMessage(getBookingErrorMessage(error, 'Unable to update this booking right now.'))
    } finally {
      setIsActionLoading(false)
    }
  }

  return (
    <DashboardShell>
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-4xl font-headline font-extrabold tracking-tight text-on-background">
              Service Dashboard
            </h1>
            <p className="text-on-surface-variant">
              Track your requests, review mechanic estimates, and approve work when it is ready.
            </p>
          </div>
          <Button
            type="button"
            tone="secondary"
            onClick={() => {
              void loadBookings({ background: true })
            }}
            disabled={isLoading || isRefreshing}
            className="min-w-40"
          >
            <MaterialIcon name="refresh" className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Dashboard'}</span>
          </Button>
        </div>
      </div>

      {errorMessage ? (
        <div className="mb-6 rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
          {errorMessage}
        </div>
      ) : null}

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-6">
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
            <MaterialIcon name="notifications_active" className="text-2xl text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Need Review
            </span>
          </div>
          <p className="text-3xl font-headline font-black text-primary">{bookingsAwaitingApproval.length}</p>
        </div>

        <div className="shell-panel p-4">
          <div className="mb-2 flex items-center gap-3">
            <MaterialIcon name="event_available" className="text-2xl text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Intake
            </span>
          </div>
          <p className="text-3xl font-headline font-black text-blue-600">{bookingsInIntake.length}</p>
        </div>

        <div className="shell-panel p-4">
          <div className="mb-2 flex items-center gap-3">
            <MaterialIcon name="precision_manufacturing" className="text-2xl text-green-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Approved
            </span>
          </div>
          <p className="text-3xl font-headline font-black text-cyan-600">{bookingsApproved.length}</p>
        </div>

        <div className="shell-panel p-4">
          <div className="mb-2 flex items-center gap-3">
            <MaterialIcon name="precision_manufacturing" className="text-2xl text-green-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              In Repair
            </span>
          </div>
          <p className="text-3xl font-headline font-black text-green-600">{bookingsInProgress.length}</p>
        </div>

        <div className="shell-panel p-4">
          <div className="mb-2 flex items-center gap-3">
            <MaterialIcon name="check_circle" className="text-2xl text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Completed
            </span>
          </div>
          <p className="text-3xl font-headline font-black text-emerald-700">{bookingsCompleted.length}</p>
        </div>
      </div>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-headline font-bold text-on-surface">Estimate Inbox</h2>
            <p className="text-sm text-on-surface-variant">
              When a mechanic sends a repair estimate, it appears here for review.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {bookingsAwaitingApproval.length} waiting
          </span>
        </div>

        {bookingsAwaitingApproval.length === 0 ? (
          <div className="shell-panel p-6 text-sm text-on-surface-variant">
            No estimate is waiting for your decision right now. New mechanic estimates will surface here before repair starts.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {bookingsAwaitingApproval.map((booking) => (
              <button
                key={booking.id}
                type="button"
                onClick={() => setSelectedBookingId(booking.id)}
                className={[
                  'shell-panel flex w-full flex-col gap-4 rounded-[1.5rem] p-6 text-left transition-all',
                  booking.id === selectedBookingId
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-primary/25 hover:bg-white',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-primary">
                      Estimate ready
                    </p>
                    <p className="mt-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                      #{formatBookingReference(booking.id)}
                    </p>
                    <h3 className="mt-2 text-xl font-headline font-extrabold text-on-surface">
                      {booking.vehicle.year > 0
                        ? `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`
                        : booking.vehicle.make}
                    </h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {booking.services.map((service) => service.name).join(', ')}
                    </p>
                  </div>
                  <MaterialIcon name="receipt_long" className="text-3xl text-primary" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-surface-container px-4 py-3">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                      Appointment
                    </p>
                    <p className="mt-1 text-sm font-bold text-on-surface">
                      {booking.scheduledDate} at {booking.scheduledTime}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-surface-container px-4 py-3">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                      Estimate total
                    </p>
                    <p className="mt-1 text-sm font-bold text-on-surface">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: booking.pricing.currency,
                        minimumFractionDigits: 2,
                      }).format(booking.estimate?.estimatedTotalCost ?? booking.pricing.totalEstimate)}
                    </p>
                  </div>
                </div>

                <p className="rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-900">
                  {booking.notes?.trim()
                    ? `Reported issue: ${booking.notes}`
                    : 'The workshop inspected your vehicle and prepared a repair estimate.'}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="mb-4">
            <h2 className="text-xl font-headline font-bold text-on-surface">Booking History</h2>
            <p className="text-sm text-on-surface-variant">
              Pending intake, repairs in progress, and completed visits stay here.
            </p>
          </div>
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
            <BookingDetailsView
              booking={selectedBooking}
              isActionLoading={isActionLoading}
              actionErrorMessage={actionErrorMessage}
              onBack={() => setSelectedBookingId(null)}
              onApproveEstimate={(bookingId) => {
                void runBookingAction(async () => {
                  const nextBooking = await approveBookingEstimateRequest(bookingId, accessToken)
                  window.dispatchEvent(new Event(approvalNotificationsRefreshEvent))
                  return nextBooking
                })
              }}
              onRequestChanges={(bookingId) => {
                void runBookingAction(() => requestBookingChangesRequest(bookingId, accessToken))
              }}
              onChoosePaymentOption={(bookingId, paymentOption) => {
                void runBookingAction(() =>
                  updateBookingPaymentOptionRequest(
                    {
                      id: bookingId,
                      paymentOption: paymentOption === 'now' ? 1 : 0,
                    },
                    accessToken,
                  ))
              }}
            />
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
