import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

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
import { TextField } from '../../shared/ui/TextField'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

const vehicleYearOptions = Array.from({ length: 12 }, (_, index) => String(2026 - index))

const savedVehiclePreset = {
  vehicleVin: '5YJ3E1EB7NF2XXXXX',
  vehicleMake: 'Tesla',
  vehicleModel: 'Model 3',
  vehicleYear: '2022',
  vehicleTrim: 'Performance Dual Motor',
} as const

function formatScheduledFor(monthKey: string, date: number, slotId: string) {
  const slot = bookingTimeSlots.find((item) => item.id === slotId)
  return formatBookingDateLabel(monthKey, date, slot?.label ?? '09:15 AM')
}

export function BookingVehiclePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
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
  const scheduledFor = formatScheduledFor(
    bookingState.selectedMonthKey,
    bookingState.selectedDate,
    bookingState.selectedSlotId
  )
  const vehicleQuery = createBookingSearchParams(bookingState, {
    includeScheduleState: bookingState.scheduleVisited,
  }).toString()
  const scheduleQuery = createBookingSearchParams(bookingState, {
    includeScheduleState: true,
  }).toString()
  const stepLinks = {
    services: `${APP_ROUTES.booking}?${vehicleQuery}`,
    schedule: `${APP_ROUTES.bookingSchedule}?${scheduleQuery}`,
    vehicle: `${APP_ROUTES.bookingVehicle}?${scheduleQuery}`,
    summary: `${APP_ROUTES.bookingSummary}?${scheduleQuery}`,
  }
  const summaryCardLinks = {
    service: stepLinks.services,
    'date-time': stepLinks.schedule,
    vehicle: stepLinks.vehicle,
    estimate: stepLinks.summary,
  }
  const selectedVehicleLabel =
    bookingState.vehicleMake || bookingState.vehicleModel
      ? `${bookingState.vehicleMake} ${bookingState.vehicleModel}`.trim()
      : undefined

  const updateBookingState = (
    partial: Partial<typeof bookingState>,
    includeScheduleState = bookingState.scheduleVisited
  ) => {
    setSearchParams(
      createBookingSearchParams({ ...bookingState, ...partial }, { includeScheduleState }),
      { replace: true }
    )
  }

  return (
    <DashboardShell searchPlaceholder="Search service...">
      <div className="mx-auto max-w-7xl pb-24 pt-12">
        <BookingProgressHeader
          currentStep="vehicle"
          title="Vehicle Details"
          description="Enter your vehicle information for more accurate diagnostics."
          stepLinks={stepLinks}
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <section className="space-y-8 rounded-xl bg-surface-container-lowest p-8 shadow-panel">
              <div className="relative">
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Saved Vehicles
                </label>
                <button
                  type="button"
                  onClick={() => updateBookingState(savedVehiclePreset)}
                  className="group flex w-full items-center justify-between rounded-xl bg-surface-container-low px-5 py-4 text-left transition-all hover:bg-surface-container hover:shadow-inner"
                >
                  <div className="flex items-center gap-4">
                    <MaterialIcon name="directions_car" className="text-primary" />
                    <div>
                      <p className="font-bold leading-none text-slate-900">Select from my vehicles</p>
                      <p className="text-xs text-on-surface-variant">Choose from 2 registered cars</p>
                    </div>
                  </div>
                  <MaterialIcon
                    name="expand_more"
                    className="text-on-surface-variant transition-transform group-hover:translate-y-0.5"
                  />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-surface-container" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline-variant">
                  or enter manually
                </span>
                <div className="h-px flex-1 bg-surface-container" />
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="vehicle-vin"
                  className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                >
                  Vehicle VIN
                </label>
                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="relative flex-1">
                    <input
                      id="vehicle-vin"
                      type="text"
                      placeholder="17-digit VIN number"
                      value={bookingState.vehicleVin}
                      onChange={(event) => updateBookingState({ vehicleVin: event.target.value })}
                      className="w-full rounded-xl border border-transparent bg-surface-container-low px-5 py-4 pr-12 font-mono tracking-wider text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary/20 focus:bg-white focus:ring-2 focus:ring-primary/15"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center text-outline-variant">
                      <MaterialIcon name="qr_code_scanner" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (bookingState.vehicleVin.startsWith('5YJ') || !bookingState.vehicleVin.trim()) {
                        updateBookingState(savedVehiclePreset)
                      }
                    }}
                    className="rounded-xl bg-surface-container-highest px-8 py-4 font-bold text-primary transition-all hover:bg-primary-container hover:text-on-primary-container active:scale-95"
                  >
                    Decode
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <TextField
                  label="Make"
                  placeholder="e.g. Tesla"
                  value={bookingState.vehicleMake}
                  onChange={(event) => updateBookingState({ vehicleMake: event.target.value })}
                  inputClassName="px-5 py-4"
                />
                <TextField
                  label="Model"
                  placeholder="e.g. Model 3"
                  value={bookingState.vehicleModel}
                  onChange={(event) => updateBookingState({ vehicleModel: event.target.value })}
                  inputClassName="px-5 py-4"
                />

                <label className="flex flex-col gap-1.5">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Year
                  </span>
                  <select
                    value={bookingState.vehicleYear}
                    onChange={(event) => updateBookingState({ vehicleYear: event.target.value })}
                    className="w-full appearance-none rounded-xl border border-transparent bg-surface-container-low px-5 py-4 text-sm text-on-surface outline-none transition focus:border-primary/20 focus:bg-white focus:ring-2 focus:ring-primary/15"
                  >
                    <option value="">Select Year</option>
                    {vehicleYearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>

                <TextField
                  label="Trim/Engine"
                  placeholder="e.g. Performance Dual Motor"
                  value={bookingState.vehicleTrim}
                  onChange={(event) => updateBookingState({ vehicleTrim: event.target.value })}
                  inputClassName="px-5 py-4"
                />
              </div>

              <div className="relative mt-10 h-48 overflow-hidden rounded-xl">
                <img
                  alt="Detailed engine compartment"
                  className="h-full w-full object-cover grayscale contrast-125 opacity-20"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCij54XDVkZxmC2GcSeiggqcdB_a45sR-jW9w5-F0-rMIZ3TxNa7vIskjPc9HViP2dhtRBeUQ20CTbjPXE1kzOYajdqZnefz7P3Exi9IxBOodPPsoDTpp2sqAcIysXOeMEF85nYw2-PN40Al_x1pKf48dI_2YWS6wxwCv8KLkJxb2Q-QZNFvRKoOHYzmdLZ9g0RWeQXu5v1vJXXzRmhcJZ63FqV-cVcZ1kQ7uC1VYZnvF9xC78OoUbbilMHEzavgQeKBMMbIZlTdM0D"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MaterialIcon name="verified_user" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">VIN Verification</p>
                    <p className="text-xs text-on-surface-variant">
                      Encrypted connection for vehicle data lookup
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-xl border border-white bg-surface-container-lowest shadow-xl shadow-slate-200/50">
                <div className="bg-slate-900 p-6 text-white">
                  <h3 className="font-headline text-lg font-bold">Booking Summary</h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-slate-400">
                    Order #AF-20942
                  </p>
                </div>

                <div className="space-y-6 p-6">
                  <div className="space-y-4">
                    {selection.selectedOptions.map((option) => (
                      <div key={option.id} className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <MaterialIcon name={option.icon} className="text-xl text-primary" />
                          <div>
                            <p className="text-sm font-bold text-slate-900">{option.title}</p>
                            <p className="text-xs text-on-surface-variant">
                              {option.summaryLabel ?? option.duration}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-bold">{option.priceLabel}</span>
                      </div>
                    ))}
                  </div>

                  <hr className="border-surface-container" />

                  <div className="flex items-center gap-4 rounded-lg bg-surface-container-low p-4">
                    <div className="rounded-lg bg-white p-2 shadow-sm">
                      <MaterialIcon name="calendar_today" className="text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Scheduled For
                      </p>
                      <p className="font-bold text-slate-900">{scheduledFor}</p>
                    </div>
                  </div>

                  <hr className="border-surface-container" />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Estimated Labor</span>
                      <span className="font-semibold">${estimatedLabor.toFixed(2)}</span>
                    </div>
                    <div className="flex items-end justify-between border-t border-surface-container pt-3">
                      <span className="text-sm font-bold text-slate-900">Total Estimate</span>
                      <div className="text-right">
                        <span className="mb-1 block text-xs leading-none text-on-surface-variant">
                          Total USD
                        </span>
                        <span className="text-2xl font-black leading-none text-primary">
                          ${totalEstimate.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(stepLinks.summary)}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 py-5 text-lg font-extrabold text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98] hover:bg-primary-dim"
                  >
                    Continue to Summary
                    <MaterialIcon name="arrow_forward" />
                  </button>

                  <p className="text-center text-[10px] leading-relaxed text-on-surface-variant">
                    No credit card required at this step. Final pricing may vary based on vehicle
                    inspection.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4 rounded-xl border border-surface-container p-4">
                <MaterialIcon name="support_agent" className="text-on-surface-variant" />
                <div>
                  <p className="text-sm font-bold">Need assistance?</p>
                  <p className="text-xs text-on-surface-variant">Speak with a service advisor</p>
                </div>
                <button type="button" className="ml-auto text-sm font-bold text-primary">
                  Chat
                </button>
              </div>
            </div>
          </aside>
        </div>

        <BookingSelectionSummary
          selectedDate={bookingState.selectedDate}
          selectedDateLabel={scheduledFor}
          selectedSlotId={bookingState.selectedSlotId}
          selectedServiceLabel={
            selection.selectedOptions.length <= 1
              ? selection.option.title
              : `${selection.selectedOptions[0].title} +${selection.selectedOptions.length - 1} more`
          }
          selectedVehicleLabel={selectedVehicleLabel}
          activeCardId="vehicle"
          cardLinks={summaryCardLinks}
        />
      </div>

      <BookingMobileStepNav currentStep="vehicle" stepLinks={stepLinks} />
    </DashboardShell>
  )
}
