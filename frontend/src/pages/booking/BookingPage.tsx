import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { BookingMobileStepNav } from '../../features/booking/components/BookingMobileStepNav'
import { BookingProgressHeader } from '../../features/booking/components/BookingProgressHeader'
import {
  bookingDiagnosticOptions,
  bookingOptionGroups,
  parseBookingPrice,
  bookingServiceOptions,
} from '../../features/booking/constants/booking-content'
import type { BookingOptionKind } from '../../features/booking/types/booking'
import { APP_ROUTES } from '../../shared/config/routes'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

export function BookingPage() {
  const navigate = useNavigate()
  const [activeKind, setActiveKind] = useState<BookingOptionKind>('service')
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    bookingServiceOptions[0].id,
  ])
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useState(bookingDiagnosticOptions[0].id)
  const [diagnosticNotes, setDiagnosticNotes] = useState('')

  const options = bookingOptionGroups[activeKind]
  const selectedOptions = useMemo(() => {
    if (activeKind === 'service') {
      return options.filter((option) => selectedServiceIds.includes(option.id))
    }

    const selectedDiagnostic =
      options.find((option) => option.id === selectedDiagnosticId) ?? options[0]

    return [selectedDiagnostic]
  }, [activeKind, options, selectedDiagnosticId, selectedServiceIds])

  const selectedOption = selectedOptions[0]
  const totalPrice = selectedOptions.reduce(
    (sum, option) => sum + parseBookingPrice(option.priceLabel),
    0
  )
  const totalDurationMinutes = selectedOptions.reduce((sum, option) => {
    const hoursMatch = option.duration.match(/(\d+)\s*h/i)
    const minutesMatch = option.duration.match(/(\d+)\s*m/i)
    const hours = hoursMatch ? Number.parseInt(hoursMatch[1], 10) : 0
    const minutes = minutesMatch ? Number.parseInt(minutesMatch[1], 10) : 0

    return sum + hours * 60 + minutes
  }, 0)
  const totalDurationLabel =
    totalDurationMinutes >= 60
      ? `${Math.floor(totalDurationMinutes / 60)}h ${String(totalDurationMinutes % 60).padStart(2, '0')}m`
      : `${totalDurationMinutes}m`
  const canContinue = activeKind === 'diagnostic' ? Boolean(selectedOption) : selectedOptions.length > 0
  const serviceSummaryLabel =
    selectedOptions.length <= 1
      ? selectedOption?.summaryLabel ?? selectedOption?.title ?? 'Workshop service'
      : `${selectedOptions.length} services selected`

  const handleContinue = () => {
    if (!canContinue || !selectedOption) {
      return
    }

    const params = new URLSearchParams({
      kind: activeKind,
    })

    if (activeKind === 'service') {
      params.set('services', selectedServiceIds.join(','))
    } else {
      params.set('option', selectedOption.id)
    }

    if (activeKind === 'diagnostic' && diagnosticNotes.trim()) {
      params.set('notes', diagnosticNotes.trim())
    }

    navigate(`${APP_ROUTES.bookingSchedule}?${params.toString()}`)
  }

  return (
    <DashboardShell searchPlaceholder="Search services or diagnostics...">
      <div className="mx-auto max-w-7xl pb-24 pt-12">
        <BookingProgressHeader
          currentStep="services"
          title="Book a Service"
          description="Select the maintenance or diagnostic services required for your vehicle."
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <section className="min-w-0">
            <div className="mb-8 inline-flex rounded-2xl bg-surface-container-low p-1.5">
              <button
                type="button"
                onClick={() => setActiveKind('service')}
                className={[
                  'rounded-xl px-8 py-2.5 text-sm font-bold transition-all',
                  activeKind === 'service'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => setActiveKind('diagnostic')}
                className={[
                  'rounded-xl px-8 py-2.5 text-sm font-bold transition-all',
                  activeKind === 'diagnostic'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                Diagnostics
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {options.map((option) => {
                const isSelected =
                  activeKind === 'service'
                    ? selectedServiceIds.includes(option.id)
                    : option.id === selectedOption?.id

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      if (activeKind === 'service') {
                        setSelectedServiceIds((current) =>
                          current.includes(option.id)
                            ? current.filter((id) => id !== option.id)
                            : [...current, option.id]
                        )

                        return
                      }

                      setSelectedDiagnosticId(option.id)
                    }}
                    className={[
                      'group relative rounded-xl border-2 p-5 text-left transition-all',
                      isSelected
                        ? 'border-primary bg-surface-container-lowest ring-4 ring-primary/5'
                        : 'border-transparent bg-surface-container-lowest hover:border-primary/20 hover:bg-surface-container-low',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div
                        className={[
                          'rounded-xl p-3 transition-colors',
                          isSelected
                            ? 'bg-primary/10 text-primary'
                            : 'bg-surface-container text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <MaterialIcon name={option.icon} className="text-2xl" />
                      </div>
                      <span className="text-lg font-bold text-on-surface">{option.priceLabel}</span>
                    </div>

                    <h3 className="mb-1 text-lg font-bold text-on-surface">{option.title}</h3>
                    <p className="text-sm leading-relaxed text-on-surface-variant">
                      {option.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        {option.duration}
                      </span>
                      {isSelected ? (
                        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                          <MaterialIcon
                            name={activeKind === 'service' ? 'check_box' : 'check_circle'}
                            className="text-sm"
                          />
                          {activeKind === 'service' ? 'Added' : 'Selected'}
                        </span>
                      ) : null}
                    </div>
                  </button>
                )
              })}
            </div>

            {activeKind === 'diagnostic' ? (
              <div className="mt-6 rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-panel">
                <label
                  htmlFor="diagnostic-notes"
                  className="mb-3 block text-sm font-bold text-on-surface"
                >
                  Describe your car&apos;s symptoms
                </label>
                <textarea
                  id="diagnostic-notes"
                  rows={4}
                  value={diagnosticNotes}
                  onChange={(event) => setDiagnosticNotes(event.target.value)}
                  placeholder="E.g. Squeaking sound when braking, check engine light is on..."
                  className="w-full rounded-xl border-none bg-surface-container-low p-4 text-sm text-on-surface transition focus:ring-2 focus:ring-primary/30"
                />
              </div>
            ) : null}
          </section>

          <aside className="w-full lg:w-96">
            <div className="sticky top-28 space-y-6">
              <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-panel">
                <div className="bg-primary p-6 text-on-primary">
                  <h2 className="text-xl font-extrabold tracking-tight">Booking Summary</h2>
                  <p className="mt-1 text-xs font-medium opacity-80">
                    Estimating your maintenance plan
                  </p>
                </div>
                <div className="p-6">
                  <div className="mb-8 space-y-4">
                    {selectedOptions.map((option) => (
                      <div key={option.id} className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-on-surface">{option.title}</p>
                          <p className="text-xs text-on-surface-variant">
                            {option.summaryLabel ??
                              (activeKind === 'service'
                                ? 'Workshop service'
                                : 'Diagnostic session')}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-on-surface">
                          {option.priceLabel}
                        </span>
                      </div>
                    ))}

                    <div className="h-px bg-surface-container" />

                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>Estimated Duration</span>
                      <span className="font-semibold text-on-surface">{totalDurationLabel}</span>
                    </div>

                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>Category</span>
                      <span className="font-semibold capitalize text-on-surface">
                        {activeKind === 'service' && selectedOptions.length > 1
                          ? `${selectedOptions.length} services`
                          : activeKind}
                      </span>
                    </div>

                    {activeKind === 'diagnostic' && diagnosticNotes.trim() ? (
                      <div className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
                        {diagnosticNotes.trim()}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-8 rounded-xl bg-surface-container-low p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-on-surface-variant">
                        {activeKind === 'service' && selectedOptions.length > 1
                          ? 'Estimated Total'
                          : 'Starting Price'}
                      </span>
                      <span className="text-2xl font-black text-primary">
                        ${totalPrice.toFixed(2)}
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
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    Continue
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
                    <p className="text-sm font-bold text-on-surface">Need help?</p>
                    <p className="text-xs text-on-surface-variant">
                      {activeKind === 'service' && selectedOptions.length > 1
                        ? serviceSummaryLabel
                        : 'Speak with a Master Tech'}
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
      </div>

      <BookingMobileStepNav currentStep="services" />
    </DashboardShell>
  )
}
