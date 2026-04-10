import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  getBookingByIdRequest,
  getBookingErrorMessage,
  type BookingDto,
} from '../../apis/bookingApi'
import { useAuth } from '../../features/auth/useAuth'
import {
  buildVehicleDetailsLabel,
  buildVehicleLabel,
  formatBookingReference,
  formatStartingPrice,
  getBookingStartingPrice,
} from '../../features/booking/lib/booking-api-helpers'
import { resolveBookingFlowState } from '../../features/booking/lib/booking-flow'
import { APP_ROUTES } from '../../shared/config/routes'
import { BrandHomeLink } from '../../shared/ui/BrandHomeLink'
import { Button } from '../../shared/ui/Button'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'

export function BookingConfirmationPage() {
  const [searchParams] = useSearchParams()
  const { tokens } = useAuth()
  const accessToken = tokens?.accessToken
  const bookingState = useMemo(() => resolveBookingFlowState(searchParams), [searchParams])
  const [booking, setBooking] = useState<BookingDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadBooking() {
      if (!bookingState.bookingId) {
        if (isMounted) {
          setIsLoading(false)
        }
        return
      }

      setIsLoading(true)
      setErrorMessage(null)

      try {
        const nextBooking = await getBookingByIdRequest(bookingState.bookingId, accessToken)

        if (isMounted) {
          setBooking(nextBooking)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            getBookingErrorMessage(error, 'Unable to load the created booking details.'),
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadBooking()

    return () => {
      isMounted = false
    }
  }, [accessToken, bookingState.bookingId])

  const startAt = booking?.startAt ?? bookingState.selectedSlotStartAt
  const selectedDateLabel = startAt
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(startAt))
    : 'Pending'
  const selectedVehicleLabel =
    bookingState.vehicleMake || bookingState.vehicleModel
      ? buildVehicleLabel({
          year: Number.parseInt(bookingState.vehicleYear, 10) || 0,
          make: bookingState.vehicleMake,
          model: bookingState.vehicleModel,
        })
      : 'Vehicle details pending'
  const selectedVehicleDetails = buildVehicleDetailsLabel({
    trim: bookingState.vehicleTrim,
    engine: bookingState.vehicleEngine,
  })
  const servicesLabel =
    booking?.services.map((service) => service.name).join(', ') || 'Pending'
  const bookingReference = formatBookingReference(booking?.id ?? bookingState.bookingId)

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface text-on-surface">
      <div className="pointer-events-none absolute -right-28 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/6 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-[24rem] w-[24rem] rounded-full bg-secondary/6 blur-[110px]" />

      <header className="relative z-10 border-b border-white/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center px-5 py-4 sm:px-8">
          <BrandHomeLink brandClassName="relative font-heading text-2xl font-black tracking-[-0.08em] text-slate-900" />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.85fr)]">
          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-surface-container-lowest shadow-[0_32px_64px_-16px_rgba(15,23,42,0.16)]">
            <div className="relative border-b border-slate-100 px-8 py-8 sm:px-10">
              <div className="absolute right-6 top-6 opacity-10">
                <MaterialIcon name="check_circle" className="rotate-12 text-[5rem]" />
              </div>
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-container/30 text-primary">
                <MaterialIcon name="check_circle" className="text-5xl" />
              </div>
              <h1 className="max-w-2xl font-headline text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Booking Successfully Created!
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-on-surface-variant">
                Your appointment is confirmed and saved.
              </p>
            </div>

            <div className="px-8 py-8 sm:px-10">
              <div className="mb-8 inline-flex flex-col items-start rounded-2xl border border-outline-variant/10 bg-surface-container-low px-6 py-4">
                <span className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                  Reference ID
                </span>
                <span className="font-headline text-2xl font-black tracking-[0.14em] text-primary">
                  #{bookingReference}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-surface-container-low/65 p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MaterialIcon name="calendar_today" className="text-[22px]" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Date & Time
                  </p>
                  <p className="mt-1 font-headline text-base font-bold text-slate-900">
                    {selectedDateLabel}
                  </p>
                </div>

                <div className="rounded-2xl bg-surface-container-low/65 p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MaterialIcon name="directions_car" className="text-[22px]" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Vehicle
                  </p>
                  <p className="mt-1 font-headline text-base font-bold text-slate-900">
                    {selectedVehicleLabel}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {bookingState.vehicleLicensePlate} • {bookingState.vehicleVin || 'No VIN'}
                  </p>
                  {selectedVehicleDetails ? (
                    <p className="mt-1 text-sm text-slate-500">{selectedVehicleDetails}</p>
                  ) : null}
                </div>

                <div className="rounded-2xl bg-surface-container-low/65 p-5 md:col-span-2">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MaterialIcon name="build" className="text-[22px]" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Services
                  </p>
                  <p className="mt-1 font-headline text-base font-bold text-slate-900">
                    {servicesLabel}
                  </p>
                </div>

                <div className="rounded-2xl bg-surface-container-low/65 p-5 md:col-span-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                        <MaterialIcon name="approval" className="text-[22px]" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                        Next Step
                      </p>
                      <p className="mt-1 font-headline text-base font-bold text-slate-900">
                        Mechanic Estimate
                      </p>
                    </div>
                    <span
                      className="rounded-full bg-secondary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary"
                    >
                      Pending
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button to={APP_ROUTES.dashboard} className="flex-1 py-4">
                  View My Dashboard
                </Button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-surface-container-highest/50 px-6 py-4 font-headline font-bold text-slate-900 transition-colors hover:bg-surface-container-highest active:scale-95"
                >
                  <MaterialIcon name="print" className="text-lg" />
                  <span>Print Summary</span>
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/70 bg-surface-container-lowest p-7 shadow-[0_24px_50px_-18px_rgba(15,23,42,0.14)]">
              <p className="mb-2 text-[0.6875rem] font-black uppercase tracking-[0.24em] text-primary">
                Booking Overview
              </p>
              <h2 className="font-headline text-2xl font-extrabold tracking-tight text-slate-900">
                Appointment Snapshot
              </h2>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                Everything is saved. You can print this page or return to the dashboard to manage the booking later.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-surface-container-low p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Request Status
                  </p>
                  <p className="mt-1 font-headline text-xl font-extrabold text-slate-900">
                    Pending
                  </p>
                </div>

                <div className="rounded-2xl bg-surface-container-low p-4">
                  {isLoading ? (
                    <p className="text-sm text-slate-500">Loading booking pricing...</p>
                  ) : (
                    <>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                        Starting labor from
                      </p>
                      <p className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-slate-900">
                        {formatStartingPrice(
                          booking ? getBookingStartingPrice(booking.pricing) : 0,
                          booking?.pricing.currency,
                        )}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        This is the booking-time service price only. Parts and any vehicle-specific adjustments are prepared later in the mechanic estimate.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-primary/10 bg-primary-container/20 p-6">
              <div className="flex items-start gap-3">
                <MaterialIcon name="mail" className="mt-0.5 text-primary" />
                <div>
                  <p className="font-headline text-base font-bold text-on-primary-container">
                    Confirmation ready
                  </p>
                  <p className="mt-1 text-sm leading-6 text-on-primary-container/80">
                    You can use this booking summary later for quick reference.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
