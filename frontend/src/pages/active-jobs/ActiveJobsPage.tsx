import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  getBookingErrorMessage,
  getBookingsRequest,
  updateBookingServiceOrderStatusRequest,
  type BookingDto,
} from '../../apis/bookingApi'
import { useAuth } from '../../features/auth/useAuth'
import { APP_ROUTES } from '../../shared/config/routes'
import { Button } from '../../shared/ui/Button'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { SelectField } from '../../shared/ui/SelectField'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'
import {
  formatBookingDate,
  formatCurrency,
  getBookingCardSubtitle,
  getBookingCardTitle,
  getBookingPaymentMethodLabel,
  getBookingSettlementLabel,
  getBookingServicesLabel,
  getBookingStatusLabel,
} from '../../features/diagnostic/lib/service-order'

type ActiveJobStatusFilter = 'all' | 'approved' | 'in-progress' | 'completed'

const activeJobStatusFilters: Array<{
  value: ActiveJobStatusFilter
  label: string
}> = [
  { value: 'all', label: 'All Jobs' },
  { value: 'approved', label: 'Approved' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

function getActiveJobPriority(status: number) {
  switch (status) {
    case 7:
      return 0
    case 3:
      return 1
    case 4:
      return 2
    default:
      return 3
  }
}

function sortActiveJobs(bookings: BookingDto[]) {
  return [...bookings].sort((left, right) => {
    const priorityDifference = getActiveJobPriority(left.status) - getActiveJobPriority(right.status)
    if (priorityDifference !== 0) {
      return priorityDifference
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  })
}

function matchesActiveJobStatusFilter(status: number, filter: ActiveJobStatusFilter) {
  switch (filter) {
    case 'approved':
      return status === 7
    case 'in-progress':
      return status === 3
    case 'completed':
      return status === 4
    default:
      return status === 7 || status === 3 || status === 4
  }
}

function getStatusBadgeClass(status: number) {
  switch (status) {
    case 7:
      return 'bg-cyan-100 text-cyan-700'
    case 3:
      return 'bg-emerald-100 text-emerald-700'
    case 4:
      return 'bg-slate-100 text-slate-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function isActiveJobStatus(status: number) {
  return status === 7 || status === 3 || status === 4
}

export function ActiveJobsPage() {
  const { tokens } = useAuth()
  const accessToken = tokens?.accessToken
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [bookings, setBookings] = useState<BookingDto[]>([])
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [statusFilterValue, setStatusFilterValue] = useState<ActiveJobStatusFilter>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isStatusUpdating, setIsStatusUpdating] = useState(false)
  const [pendingStatusValue, setPendingStatusValue] = useState<7 | 3 | 4 | 6>(7)
  const [statusActionErrorMessage, setStatusActionErrorMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const requestedBookingId = searchParams.get('bookingId')

  function upsertBooking(nextBooking: BookingDto) {
    const nextActiveBookings = sortActiveJobs(
      bookings
        .filter((booking) => booking.id !== nextBooking.id)
        .concat(nextBooking)
        .filter((booking) => isActiveJobStatus(booking.status)),
    )

    setBookings(nextActiveBookings)
    setSelectedBookingId((currentSelectedBookingId) => {
      if (isActiveJobStatus(nextBooking.status)) {
        return nextBooking.id
      }

      if (currentSelectedBookingId && nextActiveBookings.some((booking) => booking.id === currentSelectedBookingId)) {
        return currentSelectedBookingId
      }

      return nextActiveBookings[0]?.id ?? null
    })
  }

  async function loadActiveJobs(options?: { background?: boolean }) {
    const isBackgroundRefresh = options?.background ?? false

    if (isBackgroundRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }

    setErrorMessage(null)
    setStatusActionErrorMessage(null)

    try {
      const nextBookings = await getBookingsRequest({}, accessToken)
      const activeBookings = sortActiveJobs(
        nextBookings.filter((booking) => isActiveJobStatus(booking.status)),
      )

      setBookings(activeBookings)
      setSelectedBookingId((current) => {
        if (requestedBookingId && activeBookings.some((booking) => booking.id === requestedBookingId)) {
          return requestedBookingId
        }

        if (current && activeBookings.some((booking) => booking.id === current)) {
          return current
        }

        return activeBookings[0]?.id ?? null
      })
    } catch (error) {
      setBookings([])
      setSelectedBookingId(null)
      setErrorMessage(getBookingErrorMessage(error, 'Unable to load active workshop jobs.'))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  async function handleStatusUpdate(nextStatus: 7 | 3 | 4 | 6) {
    if (!selectedBooking) {
      return
    }

    setIsStatusUpdating(true)
    setStatusActionErrorMessage(null)

    try {
      const nextBooking = await updateBookingServiceOrderStatusRequest(
        {
          id: selectedBooking.id,
          status: nextStatus,
        },
        accessToken,
      )

      upsertBooking(nextBooking)

      if (nextStatus === 6) {
        navigate(`${APP_ROUTES.diagnostics}?bookingId=${nextBooking.id}`)
      }
    } catch (error) {
      setStatusActionErrorMessage(getBookingErrorMessage(error, 'Unable to update the repair status.'))
    } finally {
      setIsStatusUpdating(false)
    }
  }

  useEffect(() => {
    void loadActiveJobs()
  }, [accessToken])

  useEffect(() => {
    if (!requestedBookingId) {
      return
    }

    if (bookings.some((booking) => booking.id === requestedBookingId)) {
      setSelectedBookingId(requestedBookingId)
    }
  }, [bookings, requestedBookingId])

  const filteredBookings = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()
    return bookings.filter((booking) => {
      if (!matchesActiveJobStatusFilter(booking.status, statusFilterValue)) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const searchIndex = [
        booking.id,
        booking.vehicle?.licensePlate,
        booking.vehicle?.vin,
        booking.vehicle?.make,
        booking.vehicle?.model,
        ...booking.services.map((service) => service.name),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchIndex.includes(normalizedSearch)
    })
  }, [bookings, searchValue, statusFilterValue])

  const selectedBooking = filteredBookings.find((booking) => booking.id === selectedBookingId)
    ?? bookings.find((booking) => booking.id === selectedBookingId)
    ?? null

  useEffect(() => {
    if (selectedBooking?.status === 7 || selectedBooking?.status === 3 || selectedBooking?.status === 4) {
      setPendingStatusValue(selectedBooking.status)
      return
    }

    setPendingStatusValue(7)
  }, [selectedBooking?.id, selectedBooking?.status])

  const approvedCount = bookings.filter((booking) => booking.status === 7).length
  const inProgressCount = bookings.filter((booking) => booking.status === 3).length
  const completedCount = bookings.filter((booking) => booking.status === 4).length
  const estimateTotal = selectedBooking?.estimate?.estimatedTotalCost ?? selectedBooking?.pricing.totalEstimate ?? 0
  const partUnits = selectedBooking?.estimate?.partItems.reduce((total, item) => total + item.quantity, 0) ?? 0
  const hasStatusSelectionChanged = selectedBooking != null && pendingStatusValue !== selectedBooking.status

  return (
    <DashboardShell searchPlaceholder="Search active vehicles, plates, or requests...">
      <section className="relative overflow-hidden pb-12 pt-2">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px]" />
        <div className="pointer-events-none absolute right-0 top-16 h-80 w-80 rounded-full bg-emerald-500/10 blur-[130px]" />

        <div className="relative">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                Workshop Board
              </p>
              <h1 className="mt-2 font-headline text-4xl font-extrabold tracking-tight text-slate-900">
                Active vehicles and approved jobs
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                This board keeps approved jobs and live repairs visible after they leave the estimate queue. Use it to track which vehicle is ready to start, already in repair, completed, or ready to move back into diagnostics for a revised estimate.
              </p>
            </div>
            <Button
              type="button"
              tone="secondary"
              onClick={() => {
                void loadActiveJobs({ background: true })
              }}
              disabled={isLoading || isRefreshing}
              className="min-w-40"
            >
              <MaterialIcon name="refresh" className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Board'}</span>
            </Button>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-panel">
              <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                Approved
              </p>
              <p className="mt-3 text-3xl font-headline font-extrabold text-cyan-700">{approvedCount}</p>
            </article>
            <article className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-panel">
              <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                In Repair
              </p>
              <p className="mt-3 text-3xl font-headline font-extrabold text-emerald-700">{inProgressCount}</p>
            </article>
            <article className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-panel">
              <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                Completed
              </p>
              <p className="mt-3 text-3xl font-headline font-extrabold text-slate-700">{completedCount}</p>
            </article>
          </div>

          <div className="grid gap-6 xl:grid-cols-[25rem_minmax(0,1fr)]">
            <section className="rounded-[1.75rem] border border-white/70 bg-white/90 shadow-panel xl:sticky xl:top-24 xl:self-start">
              <div className="border-b border-slate-100 p-6">
                <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                  Active Jobs
                </p>
                <h2 className="mt-2 font-headline text-2xl font-extrabold tracking-tight text-slate-900">
                  Vehicles on the floor
                </h2>
                <div className="relative mt-5">
                  <MaterialIcon
                    name="search"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search by plate, VIN, request, or service..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeJobStatusFilters.map((filter) => {
                    const count = filter.value === 'all'
                      ? bookings.length
                      : bookings.filter((booking) => matchesActiveJobStatusFilter(booking.status, filter.value)).length
                    const isActive = statusFilterValue === filter.value

                    return (
                      <button
                        key={filter.value}
                        type="button"
                        onClick={() => setStatusFilterValue(filter.value)}
                        className={[
                          'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.6875rem] font-black uppercase tracking-[0.18em] transition-all',
                          isActive
                            ? 'border-primary/20 bg-primary text-white shadow-sm'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/20 hover:bg-white hover:text-slate-900',
                        ].join(' ')}
                      >
                        <span>{filter.label}</span>
                        <span className={isActive ? 'text-white/80' : 'text-slate-400'}>{count}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="h-[calc(100vh-13rem)] overflow-y-auto overflow-x-hidden p-4 pr-3">
                {isLoading ? (
                  <div className="rounded-2xl bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                    Loading active jobs...
                  </div>
                ) : errorMessage ? (
                  <div className="rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
                    {errorMessage}
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                    No approved or active repairs matched this view.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBookings.map((booking) => (
                      <button
                        key={booking.id}
                        type="button"
                        onClick={() => setSelectedBookingId(booking.id)}
                        className={[
                          'w-full rounded-[1.5rem] border p-5 text-left transition-all',
                          booking.id === selectedBookingId
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-primary/25 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-base font-bold text-slate-900">{getBookingCardTitle(booking)}</p>
                            <p className="mt-1 text-sm text-slate-500">{getBookingCardSubtitle(booking)}</p>
                          </div>
                          <span className={['rounded-full px-3 py-1 text-[0.6875rem] font-black uppercase tracking-[0.18em]', getStatusBadgeClass(booking.status)].join(' ')}>
                            {getBookingStatusLabel(booking.status)}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-slate-600">
                          <p>
                            <span className="font-semibold text-slate-900">Booked:</span>{' '}
                            {getBookingServicesLabel(booking)}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-900">Payment:</span>{' '}
                            {getBookingPaymentMethodLabel(booking.paymentOption)}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-900">Settlement:</span>{' '}
                            {getBookingSettlementLabel(booking)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-6">
              {!selectedBooking ? (
                <div className="flex min-h-[32rem] items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-panel">
                  <div>
                    <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Workshop Details
                    </p>
                    <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-slate-900">
                      Choose a vehicle from the board
                    </h2>
                  </div>
                </div>
              ) : (
                <>
                  <article className="rounded-[1.75rem] bg-slate-950 p-8 text-white shadow-card">
                    <div className="flex flex-wrap items-start justify-between gap-6">
                      <div>
                        <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-cyan-200">
                          Workshop Tracking
                        </p>
                        <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight">
                          {getBookingCardTitle(selectedBooking)}
                        </h2>
                        <p className="mt-2 text-sm text-slate-300">{getBookingCardSubtitle(selectedBooking)}</p>
                        <p className="mt-2 text-sm text-slate-300">
                          Appointment {formatBookingDate(selectedBooking.startAt)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span className={['rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.18em]', getStatusBadgeClass(selectedBooking.status)].join(' ')}>
                          {getBookingStatusLabel(selectedBooking.status)}
                        </span>
                        <Button
                          type="button"
                          tone="secondary"
                          onClick={() => {
                            void handleStatusUpdate(6)
                          }}
                          disabled={isStatusUpdating}
                        >
                          <MaterialIcon name="assignment_return" className="text-lg" />
                          <span>{isStatusUpdating ? 'Moving...' : 'Return To Diagnostics'}</span>
                        </Button>
                      </div>
                    </div>

                    {statusActionErrorMessage ? (
                      <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                        {statusActionErrorMessage}
                      </div>
                    ) : null}
                  </article>

                  <div className="grid gap-4 md:grid-cols-3">
                    <article className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-panel">
                      <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                        Estimate Total
                      </p>
                      <p className="mt-3 text-3xl font-headline font-extrabold text-slate-900">
                        {formatCurrency(estimateTotal)}
                      </p>
                    </article>
                    <article className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-panel">
                      <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                        Payment Method
                      </p>
                      <p className="mt-3 text-lg font-bold text-slate-900">
                        {getBookingPaymentMethodLabel(selectedBooking.paymentOption)}
                      </p>
                    </article>
                    <article className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-panel">
                      <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                        Settlement
                      </p>
                      <p className="mt-3 text-lg font-bold text-slate-900">
                        {getBookingSettlementLabel(selectedBooking)}
                      </p>
                    </article>
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
                    <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                            Repair Scope
                          </p>
                          <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
                            Estimate lines
                          </h3>
                        </div>
                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
                          {selectedBooking.estimate?.workItems.length ?? 0} work / {partUnits} parts
                        </span>
                      </div>

                      <div className="mt-6 space-y-6">
                        <div>
                          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                            Work
                          </p>
                          {selectedBooking.estimate?.workItems.length ? (
                            <div className="space-y-3">
                              {selectedBooking.estimate.workItems.map((item) => (
                                <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <p className="font-bold text-slate-900">{item.description}</p>
                                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                                        {item.laborHours.toFixed(2)}h
                                      </p>
                                    </div>
                                    <span className="font-bold text-slate-900">
                                      {formatCurrency(item.lineTotal)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                              No estimate lines yet.
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                            Parts
                          </p>
                          {selectedBooking.estimate?.partItems.length ? (
                            <div className="space-y-3">
                              {selectedBooking.estimate.partItems.map((item) => (
                                <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <p className="font-bold text-slate-900">{item.partName}</p>
                                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                                        Qty {item.quantity}
                                      </p>
                                    </div>
                                    <span className="font-bold text-slate-900">
                                      {formatCurrency(item.lineTotal)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                              No parts in this estimate.
                            </div>
                          )}
                        </div>
                      </div>
                    </article>

                    <div className="space-y-6">
                      <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
                        <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                          Repair Controls
                        </p>
                        <div className="mt-5 space-y-4 text-sm text-slate-600">
                          <p>
                            <span className="font-semibold text-slate-900">Current stage:</span>{' '}
                            {getBookingStatusLabel(selectedBooking.status)}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-900">Status selector:</span>{' '}
                            Choose the correct repair stage and apply it. If the approved scope changes, you can also send the job back to diagnostics to revise the estimate.
                          </p>
                        </div>

                        <div className="mt-5 space-y-3">
                          <label className="block">
                            <span className="mb-2 block text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                              Repair Status
                            </span>
                            <SelectField
                              value={String(pendingStatusValue)}
                              onChange={(event) => setPendingStatusValue(Number(event.target.value) as 7 | 3 | 4 | 6)}
                              disabled={isStatusUpdating}
                              className="rounded-2xl border-slate-200 bg-slate-50 py-3 font-semibold text-slate-900 focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/10"
                              iconClassName="text-slate-400"
                            >
                              <option value="7">Approved</option>
                              <option value="3">In Progress</option>
                              <option value="4">Completed</option>
                              <option value="6">Return To Diagnostics</option>
                            </SelectField>
                          </label>

                          <Button
                            type="button"
                            onClick={() => {
                              void handleStatusUpdate(pendingStatusValue)
                            }}
                            disabled={!hasStatusSelectionChanged || isStatusUpdating}
                            className="w-full"
                          >
                            <MaterialIcon name="sync" className={isStatusUpdating ? 'animate-spin text-lg' : 'text-lg'} />
                            <span>
                              {isStatusUpdating
                                ? 'Updating Status...'
                                : pendingStatusValue === 6
                                  ? 'Move To Diagnostics'
                                  : 'Apply Status'}
                            </span>
                          </Button>
                        </div>
                      </article>

                      <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
                        <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                          Handoff Summary
                        </p>
                        <div className="mt-5 space-y-4 text-sm text-slate-600">
                          <p>
                            <span className="font-semibold text-slate-900">Vehicle:</span>{' '}
                            {selectedBooking.vehicle
                              ? `${selectedBooking.vehicle.year} ${selectedBooking.vehicle.make} ${selectedBooking.vehicle.model}`
                              : 'Vehicle pending'}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-900">Plate:</span>{' '}
                            {selectedBooking.vehicle?.licensePlate ?? 'Pending'}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-900">Booked:</span>{' '}
                            {getBookingServicesLabel(selectedBooking)}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-900">Customer note:</span>{' '}
                            {selectedBooking.notes?.trim() || 'No extra note attached.'}
                          </p>
                        </div>
                      </article>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </section>
    </DashboardShell>
  )
}
