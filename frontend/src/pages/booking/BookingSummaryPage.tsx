import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  createBookingRequest,
  getAvailableBookingSlotsRequest,
  getBookingErrorMessage,
  getBookingQuoteRequest,
  getCurrentCustomerRequest,
  type BookingQuoteDto,
  type CustomerDto,
} from '../../apis/bookingApi'
import { useAuth } from '../../features/auth/useAuth'
import { BookingPaymentModal } from '../../features/booking/components/BookingPaymentModal'
import { BookingMobileStepNav } from '../../features/booking/components/BookingMobileStepNav'
import { BookingProgressHeader } from '../../features/booking/components/BookingProgressHeader'
import { BookingSelectionSummary } from '../../features/booking/components/BookingSelectionSummary'
import {
  buildVehicleDetailsLabel,
  buildVehicleLabel,
  formatBookingCurrency,
  formatBookingDuration,
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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
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
  const paymentOption = bookingState.paymentMethod === 'now' ? 1 : 0
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
          : getCurrentCustomerRequest(user.id, accessToken)
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

        const matchedSlot = availableSlots.slots.find(
          (slot) => slot.id === bookingState.selectedSlotId && slot.isAvailable,
        )

        if (!matchedSlot) {
          throw new Error('Selected booking slot is no longer available. Please choose another time.')
        }

        if (
          matchedSlot.startAt !== bookingState.selectedSlotStartAt
          && isMounted
        ) {
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
            paymentOption,
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
            getBookingErrorMessage(error, 'Unable to load the booking quote right now.'),
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
    bookingState.selectedSlotId,
    bookingState.selectedSlotStartAt,
    bookingState.selectedVehicleId,
    customer,
    paymentOption,
    selectedCatalogItemIdsKey,
    user,
  ])

  useEffect(() => {
    if (!quote) {
      return
    }

    if (quote.availablePaymentOptions.includes(paymentOption)) {
      return
    }

    setSearchParams(
      createBookingSearchParams(
        {
          ...bookingState,
          paymentMethod: quote.availablePaymentOptions.includes(0) ? 'shop' : 'now',
        },
        { includeScheduleState: true },
      ),
      { replace: true },
    )
  }, [bookingState, paymentOption, quote, setSearchParams])

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
      setErrorMessage('Booking quote is not ready yet.')
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
          paymentOption,
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
        getBookingErrorMessage(error, 'Unable to create the booking right now.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const canUsePayNow = quote?.availablePaymentOptions.includes(1) ?? true
  const canUsePayAtShop = quote?.availablePaymentOptions.includes(0) ?? true

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
                    Loading booking quote...
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
                        {service.category === 0 ? (
                          service.requiredParts.length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {service.requiredParts.map((requiredPart) => (
                                <span
                                  key={`${service.serviceCatalogItemId}-${requiredPart.partId}`}
                                  className="rounded-full bg-primary-container/20 px-3 py-1 text-[0.6875rem] font-semibold text-primary"
                                >
                                  {requiredPart.partName} x{requiredPart.quantity}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-slate-400">
                              No automatic part reservation
                            </p>
                          )
                        ) : (
                          <p className="mt-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-amber-700">
                            Diagnostic only · no stock reserved
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatBookingCurrency(service.basePrice + service.estimatedLaborCost)}
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
                  Payment Method
                </h3>

                <div className="mb-8 space-y-3">
                  <label className={`block cursor-pointer ${!canUsePayNow ? 'opacity-50' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="now"
                      checked={bookingState.paymentMethod === 'now'}
                      onChange={() => updateBookingState({ paymentMethod: 'now' })}
                      disabled={!canUsePayNow}
                      className="peer hidden"
                    />
                    <div className="rounded-xl border-2 border-slate-100 p-4 transition-all peer-checked:border-primary peer-checked:bg-primary-container/5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-bold text-slate-900">Pay Now</span>
                        <div className="flex gap-1 text-slate-400">
                          <MaterialIcon name="credit_card" className="text-lg" />
                          <MaterialIcon name="payments" className="text-lg" />
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Securely pay online with 256-bit encryption
                      </p>
                    </div>
                  </label>

                  <label className={`block cursor-pointer ${!canUsePayAtShop ? 'opacity-50' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="shop"
                      checked={bookingState.paymentMethod === 'shop'}
                      onChange={() => updateBookingState({ paymentMethod: 'shop' })}
                      disabled={!canUsePayAtShop}
                      className="peer hidden"
                    />
                    <div className="rounded-xl border-2 border-slate-100 p-4 transition-all peer-checked:border-primary peer-checked:bg-primary-container/5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-bold text-slate-900">Pay at Shop</span>
                        <MaterialIcon name="store" className="text-lg text-slate-400" />
                      </div>
                      <p className="text-xs text-slate-500">
                        Complete payment at the front desk upon arrival
                      </p>
                    </div>
                  </label>
                </div>

                <div className="mb-8 space-y-4">
                  {quote?.services.some((service) => service.category === 0 && service.requiredParts.length > 0) ? (
                    <div className="rounded-xl bg-primary-container/10 px-4 py-4 text-sm text-slate-700">
                      <p className="font-bold text-slate-900">Reserved parts</p>
                      <p className="mt-1 text-slate-600">
                        Stock is reserved for required parts as soon as this booking is created. Diagnostics do not reserve inventory.
                      </p>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-900">
                      {formatBookingCurrency(quote?.pricing.subtotal ?? 0, quote?.pricing.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Estimated Labor</span>
                    <span className="font-medium text-slate-900">
                      {formatBookingCurrency(
                        quote?.pricing.estimatedLaborCost ?? 0,
                        quote?.pricing.currency,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax</span>
                    <span className="font-medium text-slate-900">
                      {formatBookingCurrency(quote?.pricing.taxAmount ?? 0, quote?.pricing.currency)}
                    </span>
                  </div>
                  <div className="my-4 h-px bg-slate-100" />
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-slate-400">
                        Total Estimate
                      </p>
                      <p className="text-3xl font-black tracking-tighter text-slate-900">
                        {formatBookingCurrency(
                          quote?.pricing.totalEstimate ?? 0,
                          quote?.pricing.currency,
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[0.65rem] italic text-slate-400">
                        Quote from backend
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (bookingState.paymentMethod === 'shop') {
                      void handleCreateBooking()
                      return
                    }

                    setIsPaymentModalOpen(true)
                  }}
                  disabled={isLoading || isSubmitting || !quote}
                  className="mb-4 w-full rounded-xl bg-primary py-4 font-black uppercase tracking-widest text-on-primary shadow-lg shadow-primary/30 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating booking...' : 'Confirm Booking'}
                </button>

                <p className="text-center text-[0.65rem] font-medium text-slate-400">
                  Final pricing and duration are locked from the quote returned by the backend.
                </p>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary-container/20 p-4">
                <MaterialIcon name="verified" className="text-primary" />
                <p className="text-xs leading-relaxed text-on-primary-container">
                  <strong>Precision Guarantee:</strong> The quote is generated from selected
                  services, schedule, and vehicle before the booking is created.
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
              ? formatBookingCurrency(quote.pricing.totalEstimate, quote.pricing.currency)
              : undefined
          }
          activeCardId="estimate"
          cardLinks={summaryCardLinks}
        />
      </div>

      <BookingMobileStepNav currentStep="summary" stepLinks={stepLinks} />
      <BookingPaymentModal
        open={isPaymentModalOpen}
        totalAmount={quote?.pricing.totalEstimate ?? 0}
        paymentMethod={bookingState.paymentMethod}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={() => {
          setIsPaymentModalOpen(false)
          void handleCreateBooking()
        }}
      />
    </DashboardShell>
  )
}
