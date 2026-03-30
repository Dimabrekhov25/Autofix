import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { BookingCalendarPanel } from '../../features/booking/components/BookingCalendarPanel'
import { BookingMobileStepNav } from '../../features/booking/components/BookingMobileStepNav'
import { BookingProgressHeader } from '../../features/booking/components/BookingProgressHeader'
import { BookingSelectionSummary } from '../../features/booking/components/BookingSelectionSummary'
import { BookingTimeSlotsPanel } from '../../features/booking/components/BookingTimeSlotsPanel'
import {
  bookingTimeSlots,
  resolveBookingSelection,
} from '../../features/booking/constants/booking-content'
import {
  formatBookingDateLabel,
} from '../../features/booking/lib/booking-date'
import {
  createBookingSearchParams,
  resolveBookingFlowState,
} from '../../features/booking/lib/booking-flow'
import { APP_ROUTES } from '../../shared/config/routes'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

export function BookingSchedulePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const bookingState = useMemo(() => resolveBookingFlowState(searchParams), [searchParams])
  const { selectedDate, selectedSlotId } = bookingState
  const selectedSlotLabel =
    bookingTimeSlots.find((slot) => slot.id === selectedSlotId)?.label ?? '09:15 AM'

  const selection = useMemo(
    () =>
      resolveBookingSelection(
        bookingState.kind,
        bookingState.selectedDiagnosticId,
        bookingState.selectedServiceIds.join(',')
      ),
    [bookingState.kind, bookingState.selectedDiagnosticId, bookingState.selectedServiceIds]
  )
  const selectedServiceLabel =
    selection.selectedOptions.length <= 1
      ? selection.option.title
      : `${selection.selectedOptions[0].title} +${selection.selectedOptions.length - 1} more`
  const bookingQuery = createBookingSearchParams(
    { ...bookingState, scheduleVisited: true },
    { includeScheduleState: true }
  ).toString()
  const bookingSelectionRoute = `${APP_ROUTES.booking}?${bookingQuery}`
  const bookingVehicleRoute = `${APP_ROUTES.bookingVehicle}?${bookingQuery}`
  const stepLinks = {
    services: `${APP_ROUTES.booking}?${bookingQuery}`,
    schedule: `${APP_ROUTES.bookingSchedule}?${bookingQuery}`,
    vehicle: `${APP_ROUTES.bookingVehicle}?${bookingQuery}`,
    summary: `${APP_ROUTES.bookingSummary}?${bookingQuery}`,
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

  const updateBookingState = (partial: Partial<typeof bookingState>) => {
    setSearchParams(
      createBookingSearchParams(
        { ...bookingState, ...partial, scheduleVisited: true },
        { includeScheduleState: true }
      ),
      { replace: true }
    )
  }

  return (
    <DashboardShell searchPlaceholder="Search appointments or VIN...">
      <div className="mx-auto max-w-5xl pb-24 pt-12">
        <BookingProgressHeader currentStep="schedule" stepLinks={stepLinks} />

        <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_20px_40px_rgba(45,47,49,0.06)]">
          <div className="grid min-h-[600px] grid-cols-1 md:grid-cols-12">
            <BookingCalendarPanel
              selectedMonthKey={bookingState.selectedMonthKey}
              selectedDate={selectedDate}
              onSelectDate={(date) => updateBookingState({ selectedDate: date })}
              onSelectMonthKey={(monthKey, date) =>
                updateBookingState({ selectedMonthKey: monthKey, selectedDate: date })
              }
            />
            <BookingTimeSlotsPanel
              selectedSlotId={selectedSlotId}
              onSelectSlot={(slotId) => updateBookingState({ selectedSlotId: slotId })}
              onBack={() => navigate(bookingSelectionRoute)}
              onContinue={() => navigate(bookingVehicleRoute)}
            />
          </div>
        </div>

        <BookingSelectionSummary
          selectedDate={selectedDate}
          selectedDateLabel={formatBookingDateLabel(
            bookingState.selectedMonthKey,
            selectedDate,
            selectedSlotLabel
          )}
          selectedSlotId={selectedSlotId}
          selectedServiceLabel={selectedServiceLabel}
          selectedVehicleLabel={selectedVehicleLabel}
          activeCardId="date-time"
          cardLinks={summaryCardLinks}
        />
      </div>

      <BookingMobileStepNav currentStep="schedule" stepLinks={stepLinks} />
    </DashboardShell>
  )
}
