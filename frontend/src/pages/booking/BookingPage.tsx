import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  getBookingErrorMessage,
  getServiceCatalogItemsRequest,
  type ServiceCatalogItemDto,
} from '../../apis/bookingApi'
import { useAuth } from '../../features/auth/useAuth'
import { BookingMobileStepNav } from '../../features/booking/components/BookingMobileStepNav'
import { BookingProgressHeader } from '../../features/booking/components/BookingProgressHeader'
import { BookingSelectionSummary } from '../../features/booking/components/BookingSelectionSummary'
import {
  formatBookingDuration,
  formatStartingPrice,
  formatIsoSlotLabel,
  getSelectedCatalogItemIds,
  mapServiceTotal,
  resolveBookingOptionIcon,
} from '../../features/booking/lib/booking-api-helpers'
import {
  createBookingSearchParams,
  hasScheduleSelection,
  resolveBookingFlowState,
} from '../../features/booking/lib/booking-flow'
import type { BookingProgressStepId } from '../../features/booking/types/booking'
import { APP_ROUTES } from '../../shared/config/routes'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

function parseDurationMinutes(duration: string) {
  const [hoursPart = '0', minutesPart = '0'] = duration.split(':')
  const hours = Number.parseInt(hoursPart, 10) || 0
  const minutes = Number.parseInt(minutesPart, 10) || 0
  return hours * 60 + minutes
}

function formatCombinedDuration(items: ServiceCatalogItemDto[]) {
  const totalMinutes = items.reduce(
    (sum, item) => sum + parseDurationMinutes(item.estimatedDuration),
    0,
  )
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`
  }

  if (hours > 0) {
    return `${hours}h`
  }

  return `${minutes}m`
}

export function BookingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { tokens } = useAuth()
  const accessToken = tokens?.accessToken
  const bookingState = useMemo(() => resolveBookingFlowState(searchParams), [searchParams])
  const [services, setServices] = useState<ServiceCatalogItemDto[]>([])
  const [diagnostics, setDiagnostics] = useState<ServiceCatalogItemDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadCatalog() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const [nextServices, nextDiagnostics] = await Promise.all([
          getServiceCatalogItemsRequest({ category: 0, isActive: true }, accessToken),
          getServiceCatalogItemsRequest({ category: 1, isActive: true }, accessToken),
        ])

        if (!isMounted) {
          return
        }

        setServices(nextServices)
        setDiagnostics(nextDiagnostics)
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            getBookingErrorMessage(error, t('app.bookingPage.loadError')),
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadCatalog()

    return () => {
      isMounted = false
    }
  }, [accessToken, t])

  useEffect(() => {
    if (bookingState.kind !== 'service' || bookingState.selectedServiceIds.length > 0 || services.length === 0) {
      return
    }

    setSearchParams(
      createBookingSearchParams({
        ...bookingState,
        selectedServiceIds: [services[0].id],
      }),
      { replace: true },
    )
  }, [bookingState, services, setSearchParams])

  useEffect(() => {
    if (bookingState.kind !== 'diagnostic' || bookingState.selectedDiagnosticId || diagnostics.length === 0) {
      return
    }

    setSearchParams(
      createBookingSearchParams({
        ...bookingState,
        selectedDiagnosticId: diagnostics[0].id,
      }),
      { replace: true },
    )
  }, [bookingState, diagnostics, setSearchParams])

  const activeKind = bookingState.kind
  const options = activeKind === 'service' ? services : diagnostics
  const selectedOptions = useMemo(() => {
    if (activeKind === 'service') {
      return services.filter((option) => bookingState.selectedServiceIds.includes(option.id))
    }

    return diagnostics.filter((option) => option.id === bookingState.selectedDiagnosticId)
  }, [
    activeKind,
    bookingState.selectedDiagnosticId,
    bookingState.selectedServiceIds,
    diagnostics,
    services,
  ])
  const selectedOption = selectedOptions[0]
  const canContinue =
    activeKind === 'diagnostic'
      ? Boolean(selectedOption)
      : getSelectedCatalogItemIds(bookingState).length > 0
  const totalPrice = selectedOptions.reduce((sum, option) => sum + mapServiceTotal(option), 0)
  const totalDurationLabel =
    selectedOptions.length > 0 ? formatCombinedDuration(selectedOptions) : '0m'
  const completedSteps: BookingProgressStepId[] = hasScheduleSelection(bookingState)
    ? ['schedule']
    : []
  const bookingQuery = createBookingSearchParams(bookingState).toString()
  const scheduleQuery = createBookingSearchParams(bookingState, {
    includeScheduleState: true,
  }).toString()
  const stepLinks = {
    services: `${APP_ROUTES.booking}?${bookingQuery}`,
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
      ? `${bookingState.vehicleYear ? `${bookingState.vehicleYear} ` : ''}${bookingState.vehicleMake} ${bookingState.vehicleModel}`.trim()
      : undefined
  const selectedSlotLabel = formatIsoSlotLabel(bookingState.selectedSlotStartAt) || t('app.bookingPage.pickSlot')
  const serviceSummaryLabel =
    selectedOptions.length <= 1
      ? selectedOption?.name ?? t('app.bookingPage.workshopService')
      : t('app.bookingPage.servicesSelected', { count: selectedOptions.length })

  const updateBookingState = (partial: Partial<typeof bookingState>) => {
    setSearchParams(createBookingSearchParams({ ...bookingState, ...partial }), {
      replace: true,
    })
  }

  const handleContinue = () => {
    if (!canContinue) {
      return
    }

    navigate(
      `${APP_ROUTES.bookingSchedule}?${createBookingSearchParams(
        {
          ...bookingState,
          scheduleVisited: true,
        },
        { includeScheduleState: true },
      ).toString()}`,
    )
  }

  return (
    <DashboardShell searchPlaceholder={t('app.bookingPage.searchPlaceholder')}>
      <div className="mx-auto max-w-7xl pb-24 pt-12">
        <BookingProgressHeader
          currentStep="services"
          title={t('app.bookingPage.title')}
          description={t('app.bookingPage.description')}
          completedSteps={completedSteps}
          stepLinks={stepLinks}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <section className="min-w-0">
            <div className="mb-8 inline-flex rounded-2xl bg-surface-container-low p-1.5">
              <button
                type="button"
                onClick={() => updateBookingState({ kind: 'service' })}
                className={[
                  'rounded-xl px-8 py-2.5 text-sm font-bold transition-all',
                  activeKind === 'service'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container',
                ].join(' ')}
              >
                {t('app.bookingPage.services')}
              </button>
              <button
                type="button"
                onClick={() => updateBookingState({ kind: 'diagnostic' })}
                className={[
                  'rounded-xl px-8 py-2.5 text-sm font-bold transition-all',
                  activeKind === 'diagnostic'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container',
                ].join(' ')}
              >
                {t('app.bookingPage.diagnostics')}
              </button>
            </div>

            {errorMessage ? (
              <div className="mb-6 rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
                {errorMessage}
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-2xl bg-surface-container-lowest p-8 text-sm text-on-surface-variant shadow-panel">
                {t('app.bookingPage.loading')}
              </div>
            ) : options.length === 0 ? (
              <div className="rounded-2xl bg-surface-container-lowest p-8 text-sm text-on-surface-variant shadow-panel">
                {t('app.bookingPage.empty')}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {options.map((option) => {
                  const isSelected =
                    activeKind === 'service'
                      ? bookingState.selectedServiceIds.includes(option.id)
                      : option.id === selectedOption?.id

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        if (activeKind === 'service') {
                          updateBookingState({
                            selectedServiceIds: bookingState.selectedServiceIds.includes(option.id)
                              ? bookingState.selectedServiceIds.filter((id) => id !== option.id)
                              : [...bookingState.selectedServiceIds, option.id],
                          })

                          return
                        }

                        updateBookingState({ selectedDiagnosticId: option.id })
                      }}
                      className={[
                        'group relative rounded-xl border-2 p-5 text-left transition-all',
                        isSelected
                          ? 'border-primary bg-surface-container-lowest ring-4 ring-primary/5'
                          : 'border-transparent bg-surface-container-lowest hover:border-primary/20 hover:bg-surface-container-low',
                      ].join(' ')}
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div
                          className={[
                            'rounded-xl p-3 transition-colors',
                            isSelected
                              ? 'bg-primary/10 text-primary'
                              : 'bg-surface-container text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary',
                          ].join(' ')}
                        >
                          <MaterialIcon
                            name={resolveBookingOptionIcon(option.name, option.category)}
                            className="text-2xl"
                          />
                        </div>
                        <span className="text-lg font-bold text-on-surface">
                          {formatStartingPrice(mapServiceTotal(option))}
                        </span>
                      </div>

                       <h3 className="mb-1 text-lg font-bold text-on-surface">{option.name}</h3>
                       <p className="text-sm leading-relaxed text-on-surface-variant">
                         {option.description}
                       </p>

                        <div className="mt-4 inline-flex rounded-full bg-surface-container px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                          {option.category === 0
                            ? t('app.bookingPage.partsChosenAfterInspection')
                            : t('app.bookingPage.diagnosticRequestOnly')}
                        </div>

                       <div className="mt-4 flex items-center justify-between gap-3">
                         <span className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                           {formatBookingDuration(option.estimatedDuration)}
                         </span>
                        {isSelected ? (
                          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                            <MaterialIcon
                              name={activeKind === 'service' ? 'check_box' : 'check_circle'}
                              className="text-sm"
                            />
                            {activeKind === 'service' ? t('app.bookingPage.added') : t('app.bookingPage.selected')}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {activeKind === 'diagnostic' ? (
              <div className="mt-6 rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-panel">
                <label
                  htmlFor="diagnostic-notes"
                  className="mb-3 block text-sm font-bold text-on-surface"
                >
                  {t('app.bookingPage.symptomsLabel')}
                </label>
                <textarea
                  id="diagnostic-notes"
                  rows={4}
                  value={bookingState.diagnosticNotes}
                  onChange={(event) =>
                    updateBookingState({ diagnosticNotes: event.target.value })
                  }
                  placeholder={t('app.bookingPage.symptomsPlaceholder')}
                  className="w-full rounded-xl border-none bg-surface-container-low p-4 text-sm text-on-surface transition focus:ring-2 focus:ring-primary/30"
                />
              </div>
            ) : null}
          </section>

          <aside className="w-full lg:w-96">
            <div className="sticky top-28 space-y-6">
              <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-panel">
                <div className="bg-primary p-6 text-on-primary">
                  <h2 className="text-xl font-extrabold tracking-tight">{t('app.bookingPage.summary')}</h2>
                  <p className="mt-1 text-xs font-medium opacity-80">
                    {t('app.bookingPage.startingLaborView')}
                  </p>
                </div>
                <div className="p-6">
                  <div className="mb-8 space-y-4">
                    {selectedOptions.map((option) => (
                      <div key={option.id} className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-on-surface">{option.name}</p>
                          <p className="text-xs text-on-surface-variant">
                            {activeKind === 'service' ? t('app.bookingPage.workshopService') : t('app.bookingPage.diagnosticSession')}
                          </p>
                          <p className="mt-1 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                            {option.category === 0 ? t('app.bookingPage.partsAddedAfterInspection') : t('app.bookingPage.diagnosticLaborFrom')}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-on-surface">
                          {formatStartingPrice(mapServiceTotal(option))}
                        </span>
                      </div>
                    ))}

                    <div className="h-px bg-surface-container" />

                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>{t('app.bookingPage.estimatedDuration')}</span>
                      <span className="font-semibold text-on-surface">{totalDurationLabel}</span>
                    </div>

                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>{t('app.bookingPage.category')}</span>
                      <span className="font-semibold capitalize text-on-surface">
                        {activeKind === 'service' && selectedOptions.length > 1
                          ? t('app.bookingPage.servicesSelected', { count: selectedOptions.length })
                          : activeKind}
                      </span>
                    </div>

                    {activeKind === 'diagnostic' && bookingState.diagnosticNotes.trim() ? (
                      <div className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
                        {bookingState.diagnosticNotes.trim()}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-8 rounded-xl bg-surface-container-low p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-on-surface-variant">
                        {t('app.bookingPage.startingLaborFrom')}
                      </span>
                      <span className="text-2xl font-black text-primary">
                        {formatStartingPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!canContinue}
                    className={[
                      'flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-on-primary transition-all',
                      canContinue
                        ? 'bg-gradient-to-r from-primary to-primary-dim shadow-lg shadow-primary/20 hover:-translate-y-0.5'
                        : 'cursor-not-allowed bg-surface-container text-on-surface-variant',
                    ].join(' ')}
                  >
                    {t('app.bookingPage.continue')}
                    <MaterialIcon name="arrow_forward" />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-low p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-sm">
                    <MaterialIcon name="support_agent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{t('app.bookingPage.needHelp')}</p>
                    <p className="text-xs text-on-surface-variant">
                      {activeKind === 'service' && selectedOptions.length > 1
                        ? serviceSummaryLabel
                        : t('app.bookingPage.speakWithMasterTech')}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ml-auto rounded-full bg-surface-container-lowest p-2 text-primary shadow-sm"
                  >
                    <MaterialIcon name="chat_bubble" className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <BookingSelectionSummary
          selectedDate={bookingState.selectedDate}
          selectedDateLabel={
            bookingState.selectedSlotId || bookingState.selectedSlotStartAt
              ? selectedSlotLabel
              : undefined
          }
          selectedSlotId={bookingState.selectedSlotId}
          selectedServiceLabel={
            selectedOptions.length <= 1
              ? selectedOption?.name
              : t('app.bookingPage.moreServices', { name: selectedOption?.name ?? t('app.bookingPage.service'), count: selectedOptions.length - 1 })
          }
          selectedVehicleLabel={selectedVehicleLabel}
          activeCardId="service"
          cardLinks={summaryCardLinks}
        />
      </div>

      <BookingMobileStepNav
        currentStep="services"
        completedSteps={completedSteps}
        stepLinks={stepLinks}
      />
    </DashboardShell>
  )
}
