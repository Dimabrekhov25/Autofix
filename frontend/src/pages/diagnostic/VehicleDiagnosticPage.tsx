import { useDeferredValue, useEffect, useMemo, useState } from 'react'

import { getBookingErrorMessage, getBookingsRequest, type BookingDto } from '../../apis/bookingApi'
import {
  getPartsRequest,
  getServiceCatalogItemsRequest,
  type CatalogPartDto,
  type ServiceCatalogItemDto,
} from '../../apis/catalogApi'
import {
  addManualServiceOrderPartRequest,
  addServiceOrderCatalogItemsRequest,
  getServiceOrderByBookingRequest,
  getServiceOrdersErrorMessage,
  removeServiceOrderPartItemRequest,
  updateServiceOrderStatusRequest,
  type ServiceOrderDto,
} from '../../apis/serviceOrdersApi'
import { useAuth } from '../../features/auth/useAuth'
import { ServiceOrderBookingsList } from '../../features/diagnostic/components/ServiceOrderBookingsList'
import { ServiceOrderDetailsPanel } from '../../features/diagnostic/components/ServiceOrderDetailsPanel'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

export function VehicleDiagnosticPage() {
  const { tokens } = useAuth()
  const accessToken = tokens?.accessToken

  const [bookings, setBookings] = useState<BookingDto[]>([])
  const [serviceCatalogItems, setServiceCatalogItems] = useState<ServiceCatalogItemDto[]>([])
  const [parts, setParts] = useState<CatalogPartDto[]>([])
  const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null)
  const [serviceOrder, setServiceOrder] = useState<ServiceOrderDto | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [bookingsErrorMessage, setBookingsErrorMessage] = useState<string | null>(null)
  const [detailsErrorMessage, setDetailsErrorMessage] = useState<string | null>(null)
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null)
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<number>(1)
  const [selectedServiceCatalogItemIds, setSelectedServiceCatalogItemIds] = useState<string[]>([])
  const [manualPartId, setManualPartId] = useState('')
  const [manualPartQuantity, setManualPartQuantity] = useState('1')
  const deferredSearchValue = useDeferredValue(searchValue)

  useEffect(() => {
    let isMounted = true

    async function loadWorkspaceData() {
      setBookingsLoading(true)
      setBookingsErrorMessage(null)

      try {
        const [nextBookings, nextServiceItems, nextParts] = await Promise.all([
          getBookingsRequest({}, accessToken),
          getServiceCatalogItemsRequest({ category: 0, isActive: true }, accessToken),
          getPartsRequest(accessToken),
        ])

        if (!isMounted) {
          return
        }

        const sortedBookings = [...nextBookings].sort(
          (left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime(),
        )

        setBookings(sortedBookings)
        setServiceCatalogItems(nextServiceItems)
        setParts(nextParts)
        setSelectedBooking((current) => {
          if (current) {
            return sortedBookings.find((booking) => booking.id === current.id) ?? sortedBookings[0] ?? null
          }

          return sortedBookings[0] ?? null
        })
      } catch (error) {
        if (isMounted) {
          setBookingsErrorMessage(
            getBookingErrorMessage(error, 'Unable to load bookings for the diagnostic workspace.'),
          )
        }
      } finally {
        if (isMounted) {
          setBookingsLoading(false)
        }
      }
    }

    void loadWorkspaceData()

    return () => {
      isMounted = false
    }
  }, [accessToken])

  useEffect(() => {
    let isMounted = true

    async function loadSelectedServiceOrder() {
      if (!selectedBooking) {
        setServiceOrder(null)
        setDetailsErrorMessage(null)
        return
      }

      setDetailsLoading(true)
      setDetailsErrorMessage(null)
      setActionErrorMessage(null)
      setActionSuccessMessage(null)

      try {
        const nextServiceOrder = await getServiceOrderByBookingRequest(selectedBooking.id, accessToken)

        if (!isMounted) {
          return
        }

        setServiceOrder(nextServiceOrder)
        setSelectedStatus(nextServiceOrder.status)
        setSelectedServiceCatalogItemIds([])
        setManualPartId('')
        setManualPartQuantity('1')
      } catch (error) {
        if (isMounted) {
          setServiceOrder(null)
          setDetailsErrorMessage(
            getServiceOrdersErrorMessage(error, 'Unable to load the service order for this booking.'),
          )
        }
      } finally {
        if (isMounted) {
          setDetailsLoading(false)
        }
      }
    }

    void loadSelectedServiceOrder()

    return () => {
      isMounted = false
    }
  }, [accessToken, selectedBooking?.id])

  const filteredBookings = useMemo(() => {
    const normalizedSearch = deferredSearchValue.trim().toLowerCase()

    if (!normalizedSearch) {
      return bookings
    }

    return bookings.filter((booking) => {
      const searchIndex = [
        booking.vehicle?.make,
        booking.vehicle?.model,
        booking.vehicle?.licensePlate,
        booking.vehicle?.vin,
        ...booking.services.map((service) => service.name),
        booking.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchIndex.includes(normalizedSearch)
    })
  }, [bookings, deferredSearchValue])

  async function runServiceOrderMutation(
    action: () => Promise<ServiceOrderDto>,
    successMessage: string,
  ) {
    if (!selectedBooking) {
      return
    }

    setIsSubmitting(true)
    setActionErrorMessage(null)
    setActionSuccessMessage(null)

    try {
      const nextServiceOrder = await action()
      setServiceOrder(nextServiceOrder)
      setSelectedStatus(nextServiceOrder.status)
      setActionSuccessMessage(successMessage)
    } catch (error) {
      setActionErrorMessage(
        getServiceOrdersErrorMessage(error, 'Unable to update the service order right now.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleBookingSelect(booking: BookingDto) {
    setSelectedBooking(booking)
  }

  function handleApplyStatus() {
    if (!serviceOrder) {
      return
    }

    void runServiceOrderMutation(
      () =>
        updateServiceOrderStatusRequest(
          {
            id: serviceOrder.id,
            status: selectedStatus as 1 | 2 | 3 | 4 | 5 | 6,
          },
          accessToken,
        ),
      selectedStatus === 6
        ? 'Service order completed and reserved stock has been consumed.'
        : 'Service order status updated.',
    )
  }

  function handleAddSelectedServices() {
    if (!serviceOrder || selectedServiceCatalogItemIds.length === 0) {
      return
    }

    void runServiceOrderMutation(
      () =>
        addServiceOrderCatalogItemsRequest(
          {
            id: serviceOrder.id,
            serviceCatalogItemIds: selectedServiceCatalogItemIds,
          },
          accessToken,
        ),
      'Selected services were added and their required parts are now reserved.',
    )

    setSelectedServiceCatalogItemIds([])
  }

  function handleAddManualPart() {
    if (!serviceOrder || !manualPartId) {
      return
    }

    const quantity = Number.parseInt(manualPartQuantity, 10)
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setActionErrorMessage('Manual part quantity must be greater than zero.')
      return
    }

    void runServiceOrderMutation(
      () =>
        addManualServiceOrderPartRequest(
          {
            id: serviceOrder.id,
            partId: manualPartId,
            quantity,
          },
          accessToken,
        ),
      'Manual part reserved successfully.',
    )

    setManualPartId('')
    setManualPartQuantity('1')
  }

  function handleRemovePart(partItemId: string) {
    if (!serviceOrder) {
      return
    }

    void runServiceOrderMutation(
      () => removeServiceOrderPartItemRequest(serviceOrder.id, partItemId, accessToken),
      'Reserved part released back to inventory.',
    )
  }

  return (
    <DashboardShell searchPlaceholder="Search bookings, vehicles, or services...">
      <section className="relative overflow-hidden pb-12 pt-2">
        <div className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-24 h-96 w-96 rounded-full bg-amber-500/10 blur-[140px]" />

        <div className="relative">
          <div className="mb-10 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.9fr)]">
            <article className="rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-card sm:px-10">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[0.6875rem] font-black uppercase tracking-[0.24em] text-cyan-200">
                Live Mechanic Workspace
              </span>
              <h1 className="mt-5 max-w-3xl font-headline text-4xl font-extrabold tracking-tight sm:text-5xl">
                Diagnose, expand the repair scope, and control inventory from the service order.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Diagnostics stay stock-safe. Repair services and manual parts reserve inventory only when the mechanic decides they are actually needed.
              </p>
            </article>

            <article className="rounded-[2rem] bg-white/90 p-8 shadow-panel backdrop-blur">
              <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                What happens here
              </p>
              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
                <p>1. Pick a booking from the live queue.</p>
                <p>2. Review the linked service order and move it through diagnosis and approval.</p>
                <p>3. Add real repair services or manual parts. Every addition updates inventory reservations immediately.</p>
              </div>
            </article>
          </div>

          <div className="grid gap-6 xl:grid-cols-[26rem_minmax(0,1fr)]">
            <ServiceOrderBookingsList
              bookings={filteredBookings}
              isLoading={bookingsLoading}
              errorMessage={bookingsErrorMessage}
              selectedBookingId={selectedBooking?.id ?? null}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onBookingSelect={handleBookingSelect}
            />

            <ServiceOrderDetailsPanel
              booking={selectedBooking}
              serviceOrder={serviceOrder}
              isLoading={detailsLoading}
              errorMessage={detailsErrorMessage}
              actionErrorMessage={actionErrorMessage}
              actionSuccessMessage={actionSuccessMessage}
              selectedStatus={selectedStatus}
              selectedServiceCatalogItemIds={selectedServiceCatalogItemIds}
              manualPartId={manualPartId}
              manualPartQuantity={manualPartQuantity}
              serviceCatalogItems={serviceCatalogItems}
              parts={parts}
              isSubmitting={isSubmitting}
              onStatusChange={setSelectedStatus}
              onServiceSelectionChange={setSelectedServiceCatalogItemIds}
              onManualPartIdChange={setManualPartId}
              onManualPartQuantityChange={setManualPartQuantity}
              onApplyStatus={handleApplyStatus}
              onAddSelectedServices={handleAddSelectedServices}
              onAddManualPart={handleAddManualPart}
              onRemovePart={handleRemovePart}
            />
          </div>
        </div>
      </section>
    </DashboardShell>
  )
}
