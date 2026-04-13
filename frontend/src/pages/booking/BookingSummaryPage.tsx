import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  createBookingRequest,
  ensureCurrentCustomerRequest,
  getAvailableBookingSlotsRequest,
  getBookingErrorMessage,
  getBookingQuoteRequest,
  getVehiclesRequest,
  type BookingQuoteDto,
  type CustomerDto,
} from '../../apis/bookingApi'
import { useAuth } from '../../features/auth/useAuth'
import { BookingMobileStepNav } from '../../features/booking/components/BookingMobileStepNav'
import { BookingProgressHeader } from '../../features/booking/components/BookingProgressHeader'
import { BookingSelectionSummary } from '../../features/booking/components/BookingSelectionSummary'
import {
  buildVehicleDetailsLabel,
  buildVehicleLabel,
  formatBookingDuration,
  formatStartingPrice,
  getBookingStartingPrice,
  getSelectedCatalogItemIds,
  resolveBookingOptionIcon,
} from '../../features/booking/lib/booking-api-helpers'
import {
  createBookingSearchParams,
  resolveBookingFlowState,
} from '../../features/booking/lib/booking-flow'
import { APP_ROUTES } from '../../shared/config/routes'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

function combineBookingNotes(summaryNotes: string, diagnosticNotes: string) {
  return [summaryNotes.trim(), diagnosticNotes.trim()].filter(Boolean).join('\n\n')
}

function toDateQuery(startAt: string) {
  const parsedDate = new Date(startAt)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const day = String(parsedDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isValidFutureSlotValue(value: string) {
  if (!value) {
    return false
  }

  const parsedDate = new Date(value)
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.getTime() > Date.now()
}

export function BookingSummaryPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { tokens, user } = useAuth()
  const accessToken = tokens?.accessToken
  const bookingState = useMemo(() => resolveBookingFlowState(searchParams), [searchParams])
  const [customer, setCustomer] = useState<CustomerDto | null>(null)
  const [quote, setQuote] = useState<BookingQuoteDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const selectedCatalogItemIdsKey =
    bookingState.kind === 'diagnostic'
      ? bookingState.selectedDiagnosticId
      : bookingState.selectedServiceIds.join(',')
  const selectedCatalogItemIds = useMemo(
    () => getSelectedCatalogItemIds(bookingState),
    [bookingState.kind, selectedCatalogItemIdsKey],
  )
  const summaryQuery = createBookingSearchParams(bookingState, {
    includeScheduleState: true,
  }).toString()
  const stepLinks = {
    services: `${APP_ROUTES.booking}?${summaryQuery}`,
    schedule: `${APP_ROUTES.bookingSchedule}?${summaryQuery}`,
    vehicle: `${APP_ROUTES.bookingVehicle}?${summaryQuery}`,
    summary: `${APP_ROUTES.bookingSummary}?${summaryQuery}`,
  }
  const summaryCardLinks = {
    service: stepLinks.services,
    'date-time': stepLinks.schedule,
    vehicle: stepLinks.vehicle,
    estimate: stepLinks.summary,
  }

  useEffect(() => {
    let isMounted = true

    async function loadSummary() {
      if (
        !user
        || !bookingState.selectedVehicleId
        || !bookingState.selectedSlotId
        || !bookingState.selectedSlotStartAt
        || selectedCatalogItemIds.length === 0
      ) {
        if (isMounted) {
          setQuote(null)
          setIsLoading(false)
        }
        return
      }

      setIsLoading(true)
      setErrorMessage(null)

      try {
        if (!isValidFutureSlotValue(bookingState.selectedSlotStartAt)) {
          throw new Error('Selected booking slot is invalid or already in the past.')
        }

        const selectedDate = toDateQuery(bookingState.selectedSlotStartAt)
        if (!selectedDate) {
          throw new Error('Selected booking slot is invalid.')
        }

        const currentCustomerPromise = customer
          ? Promise.resolve(customer)
          : ensureCurrentCustomerRequest(
            {
              userId: user.id,
              fullName: user.fullName,
              email: user.email,
            },
            accessToken,
          )
        const [resolvedCustomer, availableSlots] = await Promise.all([
          currentCustomerPromise,
          getAvailableBookingSlotsRequest(
            {
              date: selectedDate,
              serviceCatalogItemIds: selectedCatalogItemIds,
            },
            accessToken,
          ),
        ])

        const ownedVehicles = await getVehiclesRequest(
          { ownerCustomerId: resolvedCustomer.id, pageSize: 100 },
          accessToken,
        )

        const selectedVehicle = ownedVehicles.items.find(
          (vehicle) => vehicle.id === bookingState.selectedVehicleId,
        )

        if (!selectedVehicle) {
          throw new Error('The selected vehicle belongs to another customer account. Please reselect the vehicle.')
        }

        const matchedSlot = availableSlots.slots.find(
          (slot) => slot.id === bookingState.selectedSlotId && slot.isAvailable,
        )

        if (!matchedSlot) {
          throw new Error('Selected booking slot is no longer available. Please choose another time.')
        }

        if (matchedSlot.startAt !== bookingState.selectedSlotStartAt && isMounted) {
          setSearchParams(
            createBookingSearchParams(
              {
                ...bookingState,
                selectedSlotStartAt: matchedSlot.startAt,
              },
              { includeScheduleState: true },
            ),
            { replace: true },
          )
        }

        const nextQuote = await getBookingQuoteRequest(
          {
            vehicleId: bookingState.selectedVehicleId,
            startAt: matchedSlot.startAt,
            serviceCatalogItemIds: selectedCatalogItemIds,
          },
          accessToken,
        )

        if (!isMounted) {
          return
        }

        setCustomer(resolvedCustomer)
        setQuote(nextQuote)
      } catch (error) {
        if (isMounted) {
          setQuote(null)
          setErrorMessage(
            getBookingErrorMessage(error, 'Unable to load the booking estimate right now.'),
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadSummary()

    return () => {
      isMounted = false
    }
  }, [
    accessToken,
    bookingState,
    customer,
    selectedCatalogItemIds,
    selectedCatalogItemIds.length,
    setSearchParams,
    user,
  ])

  const selectedDateLabel = quote
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(new Date(quote.schedule.startAt))
    : undefined
  const selectedSlotLabel = quote
    ? new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(quote.schedule.startAt))
    : undefined
  const selectedVehicleLabel = quote
    ? buildVehicleLabel(quote.vehicle)
    : bookingState.vehicleMake || bookingState.vehicleModel
      ? `${bookingState.vehicleYear ? `${bookingState.vehicleYear} ` : ''}${bookingState.vehicleMake} ${bookingState.vehicleModel}`.trim()
      : undefined

  const updateBookingState = (partial: Partial<typeof bookingState>) => {
    setSearchParams(
      createBookingSearchParams({ ...bookingState, ...partial }, { includeScheduleState: true }),
      { replace: true },
    )
  }

  const handleCreateBooking = async () => {
    if (!customer || !quote) {
      setErrorMessage('Booking estimate is not ready yet.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const createdBooking = await createBookingRequest(
        {
          customerId: customer.id,
          vehicleId: bookingState.selectedVehicleId,
          startAt: quote.schedule.startAt,
          serviceCatalogItemIds: selectedCatalogItemIds,
          notes: combineBookingNotes(bookingState.bookingNotes, bookingState.diagnosticNotes) || null,
        },
        accessToken,
      )

      navigate(
        `${APP_ROUTES.bookingConfirmation}?${createBookingSearchParams(
          {
            ...bookingState,
            bookingId: createdBooking.id,
          },
          { includeScheduleState: true },
        ).toString()}`,
      )
    } catch (error) {
      setErrorMessage(
        getBookingErrorMessage(error, 'Unable to create the booking request right now.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell searchPlaceholder="Search bookings...">
      <div className="mx-auto max-w-7xl pb-24 pt-12">
        <BookingProgressHeader currentStep="summary" stepLinks={stepLinks} />

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  Services Selected
                </h3>
                <button
                  type="button"
                  onClick={() => navigate(stepLinks.services)}
                  className="flex items-center gap-1 text-sm font-bold text-primary transition-opacity hover:opacity-80"
                >
                  <MaterialIcon name="edit" className="text-base" />
                  Modify
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {isLoading ? (
                  <div className="rounded-2xl border border-slate-50 bg-white p-6 text-sm text-slate-500 shadow-sm md:col-span-2">
                    Loading booking estimate...
                  </div>
                ) : (
                  quote?.services.map((service) => (
                    <div
                      key={service.serviceCatalogItemId}
                      className="flex items-start justify-between rounded-2xl border border-slate-50 bg-white p-6 shadow-sm transition-transform hover:scale-[1.01]"
                    >
                      <div>
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/30 text-primary">
                          <MaterialIcon
                            name={resolveBookingOptionIcon(service.name, service.category)}
                          />
                        </div>
                        <h4 className="font-bold text-slate-900">{service.name}</h4>
                        <p className="mt-1 text-sm text-slate-500">{service.description}</p>
                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                          {formatBookingDuration(service.estimatedDuration)}
                        </p>
                        <p className="mt-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-slate-400">
                          {service.category === 0
                            ? 'Starting labor only'
                            : 'Diagnostic labor only'}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatStartingPrice(service.basePrice)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <section>
                <h3 className="mb-4 text-xl font-black uppercase tracking-tight text-slate-900">
                  Schedule
                </h3>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-50 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container/20 text-primary">
                    <MaterialIcon name="calendar_today" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-bold uppercase leading-none tracking-widest text-slate-400">
                      Appointment
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {selectedDateLabel ?? 'Pending schedule'}
                    </p>
                    <p className="text-sm text-slate-500">at {selectedSlotLabel ?? 'Pending'}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-xl font-black uppercase tracking-tight text-slate-900">
                  Vehicle
                </h3>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-50 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container/20 text-primary">
                    <MaterialIcon name="electric_car" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-bold uppercase leading-none tracking-widest text-slate-400">
                      {quote?.vehicle.licensePlate || 'Vehicle'}
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {selectedVehicleLabel ?? 'Vehicle details pending'}
                    </p>
                    <p className="text-sm text-slate-500">
                      VIN:{' '}
                      <span className="font-mono font-medium text-slate-900">
                        {quote?.vehicle.vin || bookingState.vehicleVin || 'Not provided'}
                      </span>
                    </p>
                    {quote && buildVehicleDetailsLabel(quote.vehicle) ? (
                      <p className="mt-1 text-sm text-slate-500">
                        {buildVehicleDetailsLabel(quote.vehicle)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </section>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-outline-variant/20 bg-surface-container-low/50 p-8">
              <div className="mb-4 flex items-center gap-3">
                <MaterialIcon name="sticky_note_2" className="text-3xl text-slate-300" />
                <div>
                  <h4 className="font-bold text-slate-900">Booking Notes</h4>
                  <p className="text-sm text-slate-500">
                    Add arrival details or anything the technician should know.
                  </p>
                </div>
              </div>
              <textarea
                rows={4}
                value={bookingState.bookingNotes}
                onChange={(event) => updateBookingState({ bookingNotes: event.target.value })}
                placeholder="Customer will arrive early, key drop-off, extra symptom details..."
                className="w-full rounded-xl border-none bg-white p-4 text-sm text-slate-900 shadow-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-slate-50 bg-white p-8 shadow-xl shadow-slate-200/50">
                <h3 className="mb-6 text-xl font-black uppercase tracking-tight text-slate-900">
                  Request Summary
                </h3>

                <div className="mb-8 space-y-4">
                  <div className="rounded-xl bg-primary-container/10 px-4 py-4 text-sm text-slate-700">
                    <p className="font-bold text-slate-900">What happens next</p>
                    <p className="mt-1 text-slate-600">
                      This creates a pending booking request. The mechanic inspects the car, prepares the final estimate, and you approve it later from the dashboard.
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-4 py-4">
                    <p className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-slate-400">
                      Starting labor from
                    </p>
                    <p className="text-3xl font-black tracking-tighter text-slate-900">
                      {formatStartingPrice(
                        quote ? getBookingStartingPrice(quote.pricing) : 0,
                        quote?.pricing.currency,
                      )}
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-slate-500">
                    This is not the final repair total. Parts and any vehicle-specific adjustments are added later by the mechanic after inspection.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    void handleCreateBooking()
                  }}
                  disabled={isLoading || isSubmitting || !quote}
                  className="mb-4 w-full rounded-xl bg-primary py-4 font-black uppercase tracking-widest text-on-primary shadow-lg shadow-primary/30 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating request...' : 'Create Pending Request'}
                </button>

                <p className="text-center text-[0.65rem] font-medium text-slate-400">
                  No payment is collected at booking time.
                </p>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary-container/20 p-4">
                <MaterialIcon name="verified" className="text-primary" />
                <p className="text-xs leading-relaxed text-on-primary-container">
                  <strong>Estimate-first flow:</strong> the booking holds the visit slot, and the final repair estimate is approved later from your dashboard.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <BookingSelectionSummary
          selectedDate={bookingState.selectedDate}
          selectedDateLabel={
            selectedDateLabel && selectedSlotLabel
              ? `${selectedDateLabel}, ${selectedSlotLabel}`
              : undefined
          }
          selectedSlotId={bookingState.selectedSlotId}
          selectedServiceLabel={
            quote?.services.length && quote.services.length > 1
              ? `${quote.services[0].name} +${quote.services.length - 1} more`
              : quote?.services[0]?.name
          }
          selectedVehicleLabel={selectedVehicleLabel}
          selectedEstimateLabel={
            quote
              ? formatStartingPrice(getBookingStartingPrice(quote.pricing), quote.pricing.currency)
              : undefined
          }
          activeCardId="estimate"
          cardLinks={summaryCardLinks}
        />
      </div>

      <BookingMobileStepNav currentStep="summary" stepLinks={stepLinks} />
    </DashboardShell>
  )
}
