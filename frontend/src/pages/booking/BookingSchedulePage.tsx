import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  getAvailableBookingSlotsRequest,
  getBookingErrorMessage,
  getServiceCatalogItemsRequest,
  type BookingAvailableSlotDto,
  type ServiceCatalogItemDto,
} from '../../apis/bookingApi'
import { useAuth } from '../../features/auth/useAuth'
import { BookingCalendarPanel } from '../../features/booking/components/BookingCalendarPanel'
import { BookingMobileStepNav } from '../../features/booking/components/BookingMobileStepNav'
import { BookingProgressHeader } from '../../features/booking/components/BookingProgressHeader'
import { BookingSelectionSummary } from '../../features/booking/components/BookingSelectionSummary'
import { BookingTimeSlotsPanel } from '../../features/booking/components/BookingTimeSlotsPanel'
import {
  buildVehicleLabel,
  formatIsoSlotLabel,
  getSelectedCatalogItemIds,
} from '../../features/booking/lib/booking-api-helpers'
import {
  formatBookingDateLabel,
  getBookingMonthDayCount,
  isBookingDateAvailable,
} from '../../features/booking/lib/booking-date'
import {
  createBookingSearchParams,
  resolveBookingFlowState,
} from '../../features/booking/lib/booking-flow'
import { APP_ROUTES } from '../../shared/config/routes'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

function toDateQuery(monthKey: string, day: number) {
  return `${monthKey}-${String(day).padStart(2, '0')}`
}

export function BookingSchedulePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { tokens } = useAuth()
  const accessToken = tokens?.accessToken
  const bookingState = useMemo(() => resolveBookingFlowState(searchParams), [searchParams])
  const [catalogItems, setCatalogItems] = useState<ServiceCatalogItemDto[]>([])
  const [slots, setSlots] = useState<BookingAvailableSlotDto[]>([])
  const [isCatalogLoading, setIsCatalogLoading] = useState(true)
  const [isSlotsLoading, setIsSlotsLoading] = useState(true)
  const [isMonthAvailabilityLoading, setIsMonthAvailabilityLoading] = useState(true)
  const [availableDays, setAvailableDays] = useState<number[]>([])
  const [availabilityRefreshTick, setAvailabilityRefreshTick] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const selectedCatalogItemIdsKey =
    bookingState.kind === 'diagnostic'
      ? bookingState.selectedDiagnosticId
      : bookingState.selectedServiceIds.join(',')
  const selectedCatalogItemIds = useMemo(
    () => getSelectedCatalogItemIds(bookingState),
    [bookingState.kind, selectedCatalogItemIdsKey],
  )

  useEffect(() => {
    let isMounted = true

    async function loadCatalog() {
      setIsCatalogLoading(true)

      try {
        const [services, diagnostics] = await Promise.all([
          getServiceCatalogItemsRequest({ category: 0, isActive: true }, accessToken),
          getServiceCatalogItemsRequest({ category: 1, isActive: true }, accessToken),
        ])

        if (isMounted) {
          setCatalogItems([...services, ...diagnostics])
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            getBookingErrorMessage(error, 'Unable to load selected booking services.'),
          )
        }
      } finally {
        if (isMounted) {
          setIsCatalogLoading(false)
        }
      }
    }

    void loadCatalog()

    return () => {
      isMounted = false
    }
  }, [accessToken])

  useEffect(() => {
    const refreshAvailability = () => {
      setAvailabilityRefreshTick((current) => current + 1)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshAvailability()
      }
    }

    window.addEventListener('focus', refreshAvailability)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const intervalId = window.setInterval(refreshAvailability, 30000)

    return () => {
      window.removeEventListener('focus', refreshAvailability)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadMonthAvailability() {
      if (selectedCatalogItemIds.length === 0) {
        if (isMounted) {
          setAvailableDays([])
          setIsMonthAvailabilityLoading(false)
        }
        return
      }

      setIsMonthAvailabilityLoading(true)

      try {
        const daysInMonth = getBookingMonthDayCount(bookingState.selectedMonthKey)
        const candidateDays = Array.from({ length: daysInMonth }, (_, index) => index + 1).filter(
          (day) => isBookingDateAvailable(bookingState.selectedMonthKey, day),
        )

        const responses = await Promise.all(
          candidateDays.map((day) =>
            getAvailableBookingSlotsRequest(
              {
                date: toDateQuery(bookingState.selectedMonthKey, day),
                serviceCatalogItemIds: selectedCatalogItemIds,
              },
              accessToken,
            )
              .then((response) => ({
                day,
                hasAvailableSlots: response.slots.some((slot) => slot.isAvailable),
              }))
              .catch(() => ({
                day,
                hasAvailableSlots: false,
              })),
          ),
        )

        if (isMounted) {
          setAvailableDays(
            responses
              .filter((item) => item.hasAvailableSlots)
              .map((item) => item.day),
          )
        }
      } finally {
        if (isMounted) {
          setIsMonthAvailabilityLoading(false)
        }
      }
    }

    void loadMonthAvailability()

    return () => {
      isMounted = false
    }
  }, [
    accessToken,
    availabilityRefreshTick,
    bookingState.selectedMonthKey,
    selectedCatalogItemIdsKey,
  ])

  useEffect(() => {
    let isMounted = true

    async function loadSlots() {
      if (selectedCatalogItemIds.length === 0) {
        if (isMounted) {
          setSlots([])
          setIsSlotsLoading(false)
        }
        return
      }

      setIsSlotsLoading(true)
      setErrorMessage(null)

      try {
        const response = await getAvailableBookingSlotsRequest(
          {
            date: toDateQuery(bookingState.selectedMonthKey, bookingState.selectedDate),
            serviceCatalogItemIds: selectedCatalogItemIds,
          },
          accessToken,
        )

        if (isMounted) {
          setSlots(response.slots)
        }
      } catch (error) {
        if (isMounted) {
          setSlots([])
          setErrorMessage(
            getBookingErrorMessage(error, 'Unable to load available booking slots.'),
          )
        }
      } finally {
        if (isMounted) {
          setIsSlotsLoading(false)
        }
      }
    }

    void loadSlots()

    return () => {
      isMounted = false
    }
  }, [
    accessToken,
    availabilityRefreshTick,
    bookingState.selectedDate,
    bookingState.selectedMonthKey,
    selectedCatalogItemIdsKey,
  ])

  useEffect(() => {
    if (isMonthAvailabilityLoading) {
      return
    }

    if (availableDays.length === 0) {
      if (bookingState.selectedSlotId || bookingState.selectedSlotStartAt) {
        setSearchParams(
          createBookingSearchParams(
            {
              ...bookingState,
              selectedSlotId: '',
              selectedSlotStartAt: '',
              scheduleVisited: true,
            },
            { includeScheduleState: true },
          ),
          { replace: true },
        )
      }
      return
    }

    if (availableDays.includes(bookingState.selectedDate)) {
      return
    }

    setSearchParams(
      createBookingSearchParams(
        {
          ...bookingState,
          selectedDate: availableDays[0],
          selectedSlotId: '',
          selectedSlotStartAt: '',
          scheduleVisited: true,
        },
        { includeScheduleState: true },
      ),
      { replace: true },
    )
  }, [
    availableDays,
    bookingState,
    isMonthAvailabilityLoading,
    setSearchParams,
  ])

  useEffect(() => {
    if (isSlotsLoading) {
      return
    }

    const selectedSlotStillExists = slots.some(
      (slot) =>
        slot.isAvailable
        && (
          slot.id === bookingState.selectedSlotId
          || (!bookingState.selectedSlotId && slot.startAt === bookingState.selectedSlotStartAt)
        ),
    )

    if (selectedSlotStillExists) {
      const matchedSlot = slots.find(
        (slot) =>
          slot.isAvailable
          && (
            slot.id === bookingState.selectedSlotId
            || (!bookingState.selectedSlotId && slot.startAt === bookingState.selectedSlotStartAt)
          ),
      )

      if (
        matchedSlot
        && (
          matchedSlot.id !== bookingState.selectedSlotId
          || matchedSlot.startAt !== bookingState.selectedSlotStartAt
        )
      ) {
        setSearchParams(
          createBookingSearchParams(
            {
              ...bookingState,
              selectedSlotId: matchedSlot.id,
              selectedSlotStartAt: matchedSlot.startAt,
              scheduleVisited: true,
            },
            { includeScheduleState: true },
          ),
          { replace: true },
        )
      }

      return
    }

    const firstAvailableSlot = slots.find((slot) => slot.isAvailable)

    setSearchParams(
      createBookingSearchParams(
        {
          ...bookingState,
          selectedSlotId: firstAvailableSlot?.id ?? '',
          selectedSlotStartAt: firstAvailableSlot?.startAt ?? '',
          scheduleVisited: true,
        },
        { includeScheduleState: true },
      ),
      { replace: true },
    )
  }, [bookingState, isSlotsLoading, setSearchParams, slots])

  const selectedOptions = useMemo(
    () => catalogItems.filter((item) => selectedCatalogItemIds.includes(item.id)),
    [catalogItems, selectedCatalogItemIds],
  )
  const selectedServiceLabel =
    selectedOptions.length <= 1
      ? selectedOptions[0]?.name
      : `${selectedOptions[0]?.name ?? 'Service'} +${selectedOptions.length - 1} more`
  const selectedSlotLabel =
    slots.find((slot) => slot.id === bookingState.selectedSlotId)?.label ??
    formatIsoSlotLabel(bookingState.selectedSlotStartAt) ??
    ''
  const bookingQuery = createBookingSearchParams(
    { ...bookingState, scheduleVisited: true },
    { includeScheduleState: true },
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
  const selectedVehicleLabel = buildVehicleLabel({
    year: Number.parseInt(bookingState.vehicleYear, 10) || 0,
    make: bookingState.vehicleMake,
    model: bookingState.vehicleModel,
  })

  const updateBookingState = (partial: Partial<typeof bookingState>) => {
    setSearchParams(
      createBookingSearchParams(
        { ...bookingState, ...partial, scheduleVisited: true },
        { includeScheduleState: true },
      ),
      { replace: true },
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
              selectedDate={bookingState.selectedDate}
              availableDays={availableDays}
              isAvailabilityLoading={isMonthAvailabilityLoading}
              onSelectDate={(date) =>
                updateBookingState({
                  selectedDate: date,
                  selectedSlotId: '',
                  selectedSlotStartAt: '',
                })
              }
              onSelectMonthKey={(monthKey, date) =>
                updateBookingState({
                  selectedMonthKey: monthKey,
                  selectedDate: date,
                  selectedSlotId: '',
                  selectedSlotStartAt: '',
                })
              }
            />
            <BookingTimeSlotsPanel
              selectedSlotId={bookingState.selectedSlotId}
              slots={slots}
              isLoading={isSlotsLoading}
              errorMessage={errorMessage}
              onSelectSlot={(slotId) => {
                const selectedSlot = slots.find((slot) => slot.id === slotId)
                updateBookingState({
                  selectedSlotId: slotId,
                  selectedSlotStartAt: selectedSlot?.startAt ?? '',
                })
              }}
              onBack={() => navigate(bookingSelectionRoute)}
              onContinue={() => navigate(bookingVehicleRoute)}
              canContinue={Boolean(bookingState.selectedSlotId && bookingState.selectedSlotStartAt)}
            />
          </div>
        </div>

        <BookingSelectionSummary
          selectedDate={bookingState.selectedDate}
          selectedDateLabel={formatBookingDateLabel(
            bookingState.selectedMonthKey,
            bookingState.selectedDate,
            selectedSlotLabel,
          )}
          selectedSlotId={bookingState.selectedSlotId}
          selectedServiceLabel={
            isCatalogLoading ? 'Loading services...' : selectedServiceLabel
          }
          selectedVehicleLabel={selectedVehicleLabel}
          activeCardId="date-time"
          cardLinks={summaryCardLinks}
        />
      </div>

      <BookingMobileStepNav currentStep="schedule" stepLinks={stepLinks} />
    </DashboardShell>
  )
}
