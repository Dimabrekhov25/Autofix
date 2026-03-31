import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { BookingPaymentModal } from '../../features/booking/components/BookingPaymentModal'
import { BookingMobileStepNav } from '../../features/booking/components/BookingMobileStepNav'
import { BookingProgressHeader } from '../../features/booking/components/BookingProgressHeader'
import { BookingSelectionSummary } from '../../features/booking/components/BookingSelectionSummary'
import {
  bookingTimeSlots,
  parseBookingPrice,
  resolveBookingSelection,
} from '../../features/booking/constants/booking-content'
import { formatBookingDateLabel } from '../../features/booking/lib/booking-date'
import {
  createBookingSearchParams,
  resolveBookingFlowState,
} from '../../features/booking/lib/booking-flow'
import { APP_ROUTES } from '../../shared/config/routes'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

export function BookingSummaryPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const bookingState = useMemo(() => resolveBookingFlowState(searchParams), [searchParams])
  const selection = useMemo(
    () =>
      resolveBookingSelection(
        bookingState.kind,
        bookingState.selectedDiagnosticId,
        bookingState.selectedServiceIds.join(',')
      ),
    [bookingState.kind, bookingState.selectedDiagnosticId, bookingState.selectedServiceIds]
  )

  const subtotal = selection.selectedOptions.reduce(
    (sum, option) => sum + parseBookingPrice(option.priceLabel),
    0
  )
  const estimatedLabor = selection.selectedOptions.length * 22.5
  const totalEstimate = subtotal + estimatedLabor
  const selectedDateLabel = formatBookingDateLabel(
    bookingState.selectedMonthKey,
    bookingState.selectedDate
  )
  const selectedSlotLabel =
    bookingTimeSlots.find((slot) => slot.id === bookingState.selectedSlotId)?.label ?? '09:15 AM'
  const selectedVehicleLabel =
    bookingState.vehicleYear || bookingState.vehicleMake || bookingState.vehicleModel
      ? `${bookingState.vehicleYear ? `${bookingState.vehicleYear} ` : ''}${bookingState.vehicleMake} ${bookingState.vehicleModel}`.trim()
      : undefined
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
  const confirmationLink = `${APP_ROUTES.bookingConfirmation}?${summaryQuery}`

  const updateBookingState = (partial: Partial<typeof bookingState>) => {
    setSearchParams(
      createBookingSearchParams({ ...bookingState, ...partial }, { includeScheduleState: true }),
      { replace: true }
    )
  }

  return (
    <DashboardShell searchPlaceholder="Search bookings...">
      <div className="mx-auto max-w-7xl pb-24 pt-12">
        <BookingProgressHeader currentStep="summary" stepLinks={stepLinks} />

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
                {selection.selectedOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-start justify-between rounded-2xl border border-slate-50 bg-white p-6 shadow-sm transition-transform hover:scale-[1.01]"
                  >
                    <div>
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/30 text-primary">
                        <MaterialIcon name={option.icon} />
                      </div>
                      <h4 className="font-bold text-slate-900">{option.title}</h4>
                      <p className="mt-1 text-sm text-slate-500">
                        {option.summaryLabel ?? option.description}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900">{option.priceLabel}</span>
                  </div>
                ))}
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
                    <p className="text-lg font-bold text-slate-900">{selectedDateLabel}</p>
                    <p className="text-sm text-slate-500">at {selectedSlotLabel}</p>
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
                      {bookingState.vehicleModel || 'Vehicle'}
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {selectedVehicleLabel ?? 'Vehicle details pending'}
                    </p>
                    <p className="text-sm text-slate-500">
                      VIN:{' '}
                      <span className="font-mono font-medium text-slate-900">
                        {bookingState.vehicleVin || 'Not provided'}
                      </span>
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-outline-variant/20 bg-surface-container-low/50 p-8 text-center">
              <MaterialIcon name="add_circle" className="mb-4 text-4xl text-slate-300" />
              <h4 className="font-bold text-slate-900">Add Notes or Photos</h4>
              <p className="mt-2 max-w-xs text-sm text-slate-500">
                Provide extra context for the technician to ensure the highest precision service.
              </p>
              <button
                type="button"
                className="mt-4 rounded-full border border-slate-200 px-6 py-2 text-sm font-bold transition-colors hover:bg-white"
              >
                Attach Details
              </button>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-slate-50 bg-white p-8 shadow-xl shadow-slate-200/50">
                <h3 className="mb-6 text-xl font-black uppercase tracking-tight text-slate-900">
                  Payment Method
                </h3>

                <div className="mb-8 space-y-3">
                  <label className="block cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="now"
                      checked={bookingState.paymentMethod === 'now'}
                      onChange={() => updateBookingState({ paymentMethod: 'now' })}
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

                  <label className="block cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="shop"
                      checked={bookingState.paymentMethod === 'shop'}
                      onChange={() => updateBookingState({ paymentMethod: 'shop' })}
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
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Estimated Labor</span>
                    <span className="font-medium text-slate-900">${estimatedLabor.toFixed(2)}</span>
                  </div>
                  <div className="my-4 h-px bg-slate-100" />
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-slate-400">
                        Total Estimate
                      </p>
                      <p className="text-3xl font-black tracking-tighter text-slate-900">
                        ${totalEstimate.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[0.65rem] italic text-slate-400">Incl. all taxes</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (bookingState.paymentMethod === 'shop') {
                      navigate(confirmationLink)
                      return
                    }

                    setIsPaymentModalOpen(true)
                  }}
                  className="mb-4 w-full rounded-xl bg-primary py-4 font-black uppercase tracking-widest text-on-primary shadow-lg shadow-primary/30 transition-all hover:opacity-90 active:scale-95"
                >
                  Confirm Booking
                </button>

                <p className="text-center text-[0.65rem] font-medium text-slate-400">
                  No credit card required for <span className="text-primary">Pay at Shop</span>{' '}
                  selection. You can cancel up to 24h before without penalty.
                </p>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary-container/20 p-4">
                <MaterialIcon name="verified" className="text-primary" />
                <p className="text-xs leading-relaxed text-on-primary-container">
                  <strong>Precision Guarantee:</strong> Our Master Technicians verify all diagnostic
                  data before service commencement.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <BookingSelectionSummary
          selectedDate={bookingState.selectedDate}
          selectedDateLabel={formatBookingDateLabel(
            bookingState.selectedMonthKey,
            bookingState.selectedDate,
            selectedSlotLabel
          )}
          selectedSlotId={bookingState.selectedSlotId}
          selectedServiceLabel={
            selection.selectedOptions.length <= 1
              ? selection.option.title
              : `${selection.selectedOptions[0].title} +${selection.selectedOptions.length - 1} more`
          }
          selectedVehicleLabel={selectedVehicleLabel}
          selectedEstimateLabel={`$${totalEstimate.toFixed(2)}`}
          activeCardId="estimate"
          cardLinks={summaryCardLinks}
        />
      </div>

      <BookingMobileStepNav currentStep="summary" stepLinks={stepLinks} />
      <BookingPaymentModal
        open={isPaymentModalOpen}
        totalAmount={totalEstimate}
        paymentMethod={bookingState.paymentMethod}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={() => {
          setIsPaymentModalOpen(false)
          navigate(confirmationLink)
        }}
      />
    </DashboardShell>
  )
}
