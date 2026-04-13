import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  getBookingErrorMessage,
  getBookingsRequest,
  type BookingDto,
} from '../../apis/bookingApi'
import {
  getServiceOrderByBookingRequest,
  getServiceOrdersErrorMessage,
  updateServiceOrderStatusRequest,
  type ServiceOrderDto,
} from '../../apis/serviceOrdersApi'
import {
  formatBookingDate,
  formatCurrency,
  getBookingCardSubtitle,
  getBookingCardTitle,
  getBookingPaymentMethodLabel,
  getBookingServicesLabel,
} from '../../features/diagnostic/lib/service-order'
import { useAuth } from '../../features/auth/useAuth'
import { APP_ROUTES } from '../../shared/config/routes'
import { Button } from '../../shared/ui/Button'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

function sortAwaitingBookings(bookings: BookingDto[]) {
  return [...bookings].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  )
}

export function AwaitingCustomerPage() {
  const { t, i18n } = useTranslation()
  const { tokens } = useAuth()
  const accessToken = tokens?.accessToken
  const navigate = useNavigate()

  const [bookings, setBookings] = useState<BookingDto[]>([])
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [serviceOrder, setServiceOrder] = useState<ServiceOrderDto | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [detailsErrorMessage, setDetailsErrorMessage] = useState<string | null>(null)
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null)
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null)

  async function loadAwaitingBookings(options?: { background?: boolean }) {
    const isBackgroundRefresh = options?.background ?? false

    if (isBackgroundRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }

    setErrorMessage(null)

    try {
      const nextBookings = await getBookingsRequest({}, accessToken)
      const waitingBookings = sortAwaitingBookings(nextBookings.filter((booking) => booking.status === 2))

      setBookings(waitingBookings)
      setSelectedBookingId((current) => {
        if (current && waitingBookings.some((booking) => booking.id === current)) {
          return current
        }

        return waitingBookings[0]?.id ?? null
      })
    } catch (error) {
      setBookings([])
      setSelectedBookingId(null)
      setErrorMessage(getBookingErrorMessage(error, t('app.awaitingCustomer.loadError')))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    void loadAwaitingBookings()
  }, [accessToken])

  useEffect(() => {
    let isMounted = true

    async function loadServiceOrder() {
      if (!selectedBookingId) {
        setServiceOrder(null)
        setDetailsErrorMessage(null)
        return
      }

      setDetailsLoading(true)
      setDetailsErrorMessage(null)
      setActionErrorMessage(null)

      try {
        const nextServiceOrder = await getServiceOrderByBookingRequest(selectedBookingId, accessToken)

        if (isMounted) {
          setServiceOrder(nextServiceOrder)
        }
      } catch (error) {
        if (isMounted) {
          setServiceOrder(null)
          setDetailsErrorMessage(
            getServiceOrdersErrorMessage(error, t('app.awaitingCustomer.detailsLoadError')),
          )
        }
      } finally {
        if (isMounted) {
          setDetailsLoading(false)
        }
      }
    }

    void loadServiceOrder()

    return () => {
      isMounted = false
    }
  }, [accessToken, selectedBookingId, t])

  const filteredBookings = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    if (!normalizedSearch) {
      return bookings
    }

    return bookings.filter((booking) => {
      const searchIndex = [
        booking.id,
        booking.vehicle?.licensePlate,
        booking.vehicle?.vin,
        booking.vehicle?.make,
        booking.vehicle?.model,
        ...booking.services.map((service) => service.name),
        booking.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchIndex.includes(normalizedSearch)
    })
  }, [bookings, searchValue])

  const selectedBooking = filteredBookings.find((booking) => booking.id === selectedBookingId)
    ?? bookings.find((booking) => booking.id === selectedBookingId)
    ?? null

  async function resolveWaitingBooking(targetStatus: 6 | 7, successMessage: string) {
    if (!serviceOrder) {
      return
    }

    setIsSubmitting(true)
    setActionErrorMessage(null)
    setActionSuccessMessage(null)

    try {
      await updateServiceOrderStatusRequest(
        {
          id: serviceOrder.id,
          status: targetStatus,
        },
        accessToken,
      )

      setActionSuccessMessage(successMessage)
      await loadAwaitingBookings({ background: true })
      setServiceOrder(null)
    } catch (error) {
      setActionErrorMessage(
        getServiceOrdersErrorMessage(error, t('app.awaitingCustomer.updateError')),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalEstimate = serviceOrder?.estimatedTotalCost ?? selectedBooking?.estimate?.estimatedTotalCost ?? 0
  const totalPartQuantity = serviceOrder?.partItems.reduce((total, item) => total + item.quantity, 0) ?? 0

  return (
    <DashboardShell searchPlaceholder={t('app.awaitingCustomer.searchPlaceholder')}>
      <section className="relative overflow-hidden pb-12 pt-2">
        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="relative">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                {t('app.awaitingCustomer.eyebrow')}
              </p>
              <h1 className="mt-2 font-headline text-4xl font-extrabold tracking-tight text-slate-900">
                {t('app.awaitingCustomer.title')}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                {t('app.awaitingCustomer.description')}
              </p>
            </div>
            <Button
              type="button"
              tone="secondary"
              onClick={() => {
                void loadAwaitingBookings({ background: true })
              }}
              disabled={isLoading || isRefreshing}
              className="min-w-40"
            >
              <MaterialIcon name="refresh" className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? t('app.common.refreshing') : t('app.common.refreshList')}</span>
            </Button>
          </div>

          <div className="grid gap-6 xl:grid-cols-[25rem_minmax(0,1fr)]">
            <section className="rounded-[1.75rem] border border-white/70 bg-white/90 shadow-panel xl:sticky xl:top-24 xl:self-start">
              <div className="border-b border-slate-100 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      {t('app.awaitingCustomer.waiting')}
                    </p>
                    <h2 className="mt-2 font-headline text-2xl font-extrabold tracking-tight text-slate-900">
                      {t('app.awaitingCustomer.listTitle')}
                    </h2>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-[0.6875rem] font-black uppercase tracking-[0.18em] text-amber-700">
                    {bookings.length}
                  </span>
                </div>

                <div className="relative mt-5">
                  <MaterialIcon
                    name="search"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder={t('app.awaitingCustomer.listSearchPlaceholder')}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="h-[calc(100vh-13rem)] overflow-y-auto overflow-x-hidden p-4 pr-3">
                {isLoading ? (
                  <div className="rounded-2xl bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                    {t('app.awaitingCustomer.loading')}
                  </div>
                ) : errorMessage ? (
                  <div className="rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
                    {errorMessage}
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                    {t('app.awaitingCustomer.empty')}
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
                            <p className="mt-1 text-sm text-slate-500">{getBookingCardSubtitle(booking, t)}</p>
                          </div>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-[0.6875rem] font-black uppercase tracking-[0.18em] text-amber-700">
                            {t('app.status.waiting')}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-slate-600">
                          <p>
                            <span className="font-semibold text-slate-900">{t('app.common.booked')}</span>{' '}
                            {getBookingServicesLabel(booking, t)}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-900">{t('app.common.slot')}</span>{' '}
                            {formatBookingDate(booking.startAt, i18n.language)}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-900">{t('app.common.payment')}</span>{' '}
                            {getBookingPaymentMethodLabel(booking.paymentOption, t)}
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
                      {t('app.awaitingCustomer.detailsEyebrow')}
                    </p>
                    <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-slate-900">
                      {t('app.awaitingCustomer.chooseEstimate')}
                    </h2>
                  </div>
                </div>
              ) : (
                <>
                  <article className="rounded-[1.75rem] bg-slate-950 p-8 text-white shadow-card">
                    <div className="flex flex-wrap items-start justify-between gap-6">
                      <div>
                        <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-amber-200">
                          {t('app.awaitingCustomer.awaitingCustomer')}
                        </p>
                        <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight">
                          {getBookingCardTitle(selectedBooking)}
                        </h2>
                        <p className="mt-2 text-sm text-slate-300">{getBookingCardSubtitle(selectedBooking, t)}</p>
                        <p className="mt-2 text-sm text-slate-300">
                          {getBookingServicesLabel(selectedBooking, t)} | {formatBookingDate(selectedBooking.startAt, i18n.language)}
                        </p>
                      </div>

                      <Button
                        type="button"
                        tone="secondary"
                        onClick={() => navigate(`${APP_ROUTES.diagnostics}?bookingId=${selectedBooking.id}`)}
                      >
                        <MaterialIcon name="open_in_new" className="text-lg" />
                        <span>{t('app.awaitingCustomer.openInDiagnostic')}</span>
                      </Button>
                    </div>
                  </article>

                  {detailsErrorMessage ? (
                    <div className="rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
                      {detailsErrorMessage}
                    </div>
                  ) : null}

                  {actionErrorMessage ? (
                    <div className="rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
                      {actionErrorMessage}
                    </div>
                  ) : null}

                  {actionSuccessMessage ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                      {actionSuccessMessage}
                    </div>
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-3">
                    <article className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-panel">
                      <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                        {t('app.awaitingCustomer.estimateTotal')}
                      </p>
                      <p className="mt-3 text-3xl font-headline font-extrabold text-slate-900">
                        {formatCurrency(totalEstimate, i18n.language)}
                      </p>
                    </article>
                    <article className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-panel">
                      <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                        {t('app.awaitingCustomer.partsInEstimate')}
                      </p>
                      <p className="mt-3 text-3xl font-headline font-extrabold text-slate-900">
                        {totalPartQuantity}
                      </p>
                    </article>
                    <article className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-panel">
                      <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                        {t('app.awaitingCustomer.paymentMethod')}
                      </p>
                      <p className="mt-3 text-lg font-bold text-slate-900">
                        {getBookingPaymentMethodLabel(selectedBooking.paymentOption, t)}
                      </p>
                    </article>
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
                    <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                            {t('app.awaitingCustomer.sentEstimate')}
                          </p>
                          <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
                            {t('app.awaitingCustomer.waitingConfirmation')}
                          </h3>
                        </div>
                        <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-700">
                          {t('app.awaitingCustomer.awaitingApproval')}
                        </span>
                      </div>

                      {detailsLoading ? (
                        <div className="mt-6 rounded-2xl bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                          {t('app.awaitingCustomer.loadingDetails')}
                        </div>
                      ) : (
                        <div className="mt-6 space-y-6">
                          <div>
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                              {t('app.awaitingCustomer.customerComplaint')}
                            </p>
                            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                              {selectedBooking.notes?.trim()
                                ? selectedBooking.notes
                                : t('app.awaitingCustomer.noComplaint')}
                            </div>
                          </div>

                          <div>
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                              {t('app.awaitingCustomer.workLines')}
                            </p>
                            {serviceOrder?.workItems.length ? (
                              <div className="space-y-3">
                                {serviceOrder.workItems.map((item) => (
                                  <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                                    <div className="flex items-start justify-between gap-4">
                                      <div>
                                        <p className="font-bold text-slate-900">{item.description}</p>
                                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                                          {item.laborHours.toFixed(2)}h
                                        </p>
                                      </div>
                                      <span className="font-bold text-slate-900">
                                        {formatCurrency(item.lineTotal, i18n.language)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                                {t('app.awaitingCustomer.noWorkLines')}
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                              {t('app.awaitingCustomer.parts')}
                            </p>
                            {serviceOrder?.partItems.length ? (
                              <div className="space-y-3">
                                {serviceOrder.partItems.map((item) => (
                                  <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                                    <div className="flex items-start justify-between gap-4">
                                      <div>
                                        <p className="font-bold text-slate-900">{item.partName}</p>
                                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                                        {t('app.common.qty', { count: item.quantity })}
                                        </p>
                                      </div>
                                      <span className="font-bold text-slate-900">
                                        {formatCurrency(item.lineTotal, i18n.language)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                                {t('app.awaitingCustomer.noParts')}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </article>

                    <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
                      <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                        {t('app.awaitingCustomer.manualResolution')}
                      </p>
                      <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
                        {t('app.awaitingCustomer.removeFromWaiting')}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {t('app.awaitingCustomer.manualDescription')}
                      </p>

                      <div className="mt-5 space-y-3">
                        <Button
                          type="button"
                          onClick={() => {
                            void resolveWaitingBooking(7, t('app.awaitingCustomer.approvedSuccess'))
                          }}
                          disabled={isSubmitting || detailsLoading || !serviceOrder}
                          className="w-full"
                        >
                          {isSubmitting ? t('app.common.saving') : t('app.awaitingCustomer.markApprovedManually')}
                        </Button>

                          <Button
                            type="button"
                            tone="secondary"
                            onClick={() => {
                              void resolveWaitingBooking(6, t('app.awaitingCustomer.returnedSuccess'))
                            }}
                          disabled={isSubmitting || detailsLoading || !serviceOrder}
                          className="w-full"
                        >
                          {isSubmitting ? t('app.common.saving') : t('app.awaitingCustomer.returnToEstimate')}
                        </Button>
                      </div>
                    </article>
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
