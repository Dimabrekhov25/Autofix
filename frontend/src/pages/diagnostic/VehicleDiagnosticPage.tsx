import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  getBookingByIdRequest,
  getBookingErrorMessage,
  getBookingsRequest,
  type BookingDto,
} from '../../apis/bookingApi'
import {
  getPartsRequest,
  getServiceCatalogItemsRequest,
  type CatalogPartDto,
  type ServiceCatalogItemDto,
} from '../../apis/catalogApi'
import {
  getInventoryItemsRequest,
  type InventoryItemDto,
} from '../../apis/inventoryApi'
import {
  addManualServiceOrderPartRequest,
  addServiceOrderCatalogItemsRequest,
  getServiceOrderByBookingRequest,
  getServiceOrdersErrorMessage,
  removeServiceOrderPartItemRequest,
  removeServiceOrderWorkItemRequest,
  updateServiceOrderStatusRequest,
  updateServiceOrderWorkItemRequest,
  type ServiceOrderDto,
} from '../../apis/serviceOrdersApi'
import { useAuth } from '../../features/auth/useAuth'
import { ServiceOrderBookingsList } from '../../features/diagnostic/components/ServiceOrderBookingsList'
import { ServiceOrderDetailsPanel } from '../../features/diagnostic/components/ServiceOrderDetailsPanel'
import { Button } from '../../shared/ui/Button'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

function getDiagnosticQueuePriority(status: number) {
  switch (status) {
    case 1:
    case 6:
      return 0
    case 2:
      return 1
    case 7:
      return 2
    case 3:
      return 3
    case 4:
      return 4
    case 5:
      return 5
    default:
      return 6
  }
}

function sortDiagnosticBookings(bookings: BookingDto[]) {
  return [...bookings].sort((left, right) => {
    const priorityDifference = getDiagnosticQueuePriority(left.status) - getDiagnosticQueuePriority(right.status)
    if (priorityDifference !== 0) {
      return priorityDifference
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  })
}

export function VehicleDiagnosticPage() {
  const { tokens } = useAuth()
  const accessToken = tokens?.accessToken
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedBookingId = searchParams.get('bookingId')

  const [bookings, setBookings] = useState<BookingDto[]>([])
  const [serviceCatalogItems, setServiceCatalogItems] = useState<ServiceCatalogItemDto[]>([])
  const [inventoryParts, setInventoryParts] = useState<
    Array<CatalogPartDto & InventoryItemDto & { availableQuantity: number }>
  >([])
  const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null)
  const [serviceOrder, setServiceOrder] = useState<ServiceOrderDto | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [workspaceRefreshing, setWorkspaceRefreshing] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [bookingsErrorMessage, setBookingsErrorMessage] = useState<string | null>(null)
  const [detailsErrorMessage, setDetailsErrorMessage] = useState<string | null>(null)
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null)
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedServiceCatalogItemIds, setSelectedServiceCatalogItemIds] = useState<string[]>([])
  const [manualPartId, setManualPartId] = useState('')
  const [manualPartQuantity, setManualPartQuantity] = useState('1')
  const deferredSearchValue = useDeferredValue(searchValue)

  async function loadWorkspaceData(options?: { background?: boolean }) {
    const isBackgroundRefresh = options?.background ?? false

    if (isBackgroundRefresh) {
      setWorkspaceRefreshing(true)
    } else {
      setBookingsLoading(true)
    }
    setBookingsErrorMessage(null)

    try {
      const [nextBookings, nextServiceItems, nextParts, nextInventoryItems] = await Promise.all([
        getBookingsRequest({}, accessToken),
        getServiceCatalogItemsRequest({ category: 0, isActive: true }, accessToken),
        getPartsRequest(accessToken),
        getInventoryItemsRequest(accessToken),
      ])

      const sortedBookings = sortDiagnosticBookings(
        nextBookings.filter((booking) => booking.status === 1 || booking.status === 6 || booking.status === 5),
      )

      setBookings(sortedBookings)
      setServiceCatalogItems(nextServiceItems)
      setInventoryParts(
        nextInventoryItems
          .map((inventoryItem) => {
            const part = nextParts.find((catalogPart) => catalogPart.id === inventoryItem.partId)
            if (!part) {
              return null
            }

            return {
              ...part,
              ...inventoryItem,
              availableQuantity: inventoryItem.quantityOnHand - inventoryItem.reservedQuantity,
            }
          })
          .filter((item): item is CatalogPartDto & InventoryItemDto & { availableQuantity: number } => Boolean(item)),
      )
      setSelectedBooking((current) => {
        if (requestedBookingId) {
          return sortedBookings.find((booking) => booking.id === requestedBookingId)
            ?? current
            ?? null
        }

        if (current) {
          return sortedBookings.find((booking) => booking.id === current.id)
            ?? sortedBookings[0]
            ?? null
        }

        return sortedBookings.find((booking) => booking.status === 1 || booking.status === 6)
          ?? sortedBookings[0]
          ?? null
      })
    } catch (error) {
      setBookingsErrorMessage(
        getBookingErrorMessage(error, 'Unable to load bookings for the diagnostic workspace.'),
      )
    } finally {
      setBookingsLoading(false)
      setWorkspaceRefreshing(false)
    }
  }

  useEffect(() => {
    void loadWorkspaceData()
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
      const [nextServiceOrder, nextBooking] = await Promise.all([
        action(),
        getBookingByIdRequest(selectedBooking.id, accessToken),
      ])
      setServiceOrder(nextServiceOrder)
      setBookings((currentBookings) =>
        sortDiagnosticBookings(
          currentBookings.map((booking) => booking.id === nextBooking.id ? nextBooking : booking),
        ),
      )
      setSelectedBooking(nextBooking)
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
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('bookingId', booking.id)
    setSearchParams(nextParams, { replace: true })
  }

  function handleApplyStatus() {
    if (!serviceOrder || serviceOrder.status !== 1 && serviceOrder.status !== 6) {
      return
    }

    void runServiceOrderMutation(
      () =>
        updateServiceOrderStatusRequest(
          {
            id: serviceOrder.id,
            status: 2,
          },
          accessToken,
        ),
      serviceOrder.status === 6
        ? 'Updated estimate was sent back to the customer dashboard.'
        : 'Estimate sent to the customer dashboard for approval.',
    )
  }

  function handleMarkCompleted() {
    if (!serviceOrder || serviceOrder.status !== 3) {
      return
    }

    void runServiceOrderMutation(
      () =>
        updateServiceOrderStatusRequest(
          {
            id: serviceOrder.id,
            status: 4,
          },
          accessToken,
        ),
      'Service order marked as completed.',
    )
  }

  function handleStartRepair() {
    if (!serviceOrder || serviceOrder.status !== 7) {
      return
    }

    void runServiceOrderMutation(
      () =>
        updateServiceOrderStatusRequest(
          {
            id: serviceOrder.id,
            status: 3,
          },
          accessToken,
        ),
      'Repair started and approved parts were moved out of inventory.',
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
      'Selected services were added to the estimate.',
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
      'Part added to the estimate.',
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
      'Part removed from the estimate.',
    )
  }

  function handleRemoveWorkItem(workItemId: string) {
    if (!serviceOrder) {
      return
    }

    void runServiceOrderMutation(
      () => removeServiceOrderWorkItemRequest(serviceOrder.id, workItemId, accessToken),
      'Work item removed from the estimate.',
    )
  }

  function handleUpdateWorkItem(workItemId: string, servicePrice: number) {
    if (!serviceOrder) {
      return
    }

    void runServiceOrderMutation(
      () =>
        updateServiceOrderWorkItemRequest(
          {
            id: serviceOrder.id,
            workItemId,
            laborHours: 1,
            hourlyRate: servicePrice,
          },
          accessToken,
        ),
      'Work item pricing updated.',
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
                Mechanic Estimate Desk
              </span>
              <h1 className="mt-5 max-w-3xl font-headline text-4xl font-extrabold tracking-tight sm:text-5xl">
                Inspect the car, build the estimate, and send it to the client before any repair starts.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Online booking only captures the requested service and visit slot. In this workspace the mechanic reviews the complaint, adds the actual repair work, picks parts from inventory, and publishes the estimate to the customer dashboard.
              </p>
            </article>

            <article className="rounded-[2rem] bg-white/90 p-8 shadow-panel backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                    Estimate workflow
                  </p>
                  <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
                    <p>1. Open a pending booking and review the reported issue.</p>
                    <p>2. Build the repair estimate with labor lines and inventory-backed parts.</p>
                    <p>3. Send the estimate to the customer dashboard. After approval, start the repair from this workspace.</p>
                  </div>
                </div>
                <Button
                  type="button"
                  tone="secondary"
                  onClick={() => {
                    void loadWorkspaceData({ background: true })
                  }}
                  disabled={bookingsLoading || workspaceRefreshing}
                  className="min-w-36"
                >
                  <MaterialIcon name="refresh" className={workspaceRefreshing ? 'animate-spin' : ''} />
                  <span>{workspaceRefreshing ? 'Refreshing...' : 'Refresh queue'}</span>
                </Button>
              </div>
            </article>
          </div>

          <div className="grid gap-6 xl:grid-cols-[26rem_minmax(0,1fr)]">
            <div className="xl:sticky xl:top-24 xl:self-start">
              <ServiceOrderBookingsList
                bookings={filteredBookings}
                isLoading={bookingsLoading}
                errorMessage={bookingsErrorMessage}
                selectedBookingId={selectedBooking?.id ?? null}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onBookingSelect={handleBookingSelect}
              />
            </div>

            <ServiceOrderDetailsPanel
              booking={selectedBooking}
              serviceOrder={serviceOrder}
              isLoading={detailsLoading}
              errorMessage={detailsErrorMessage}
              actionErrorMessage={actionErrorMessage}
              actionSuccessMessage={actionSuccessMessage}
              selectedServiceCatalogItemIds={selectedServiceCatalogItemIds}
              manualPartId={manualPartId}
              manualPartQuantity={manualPartQuantity}
              serviceCatalogItems={serviceCatalogItems}
              inventoryParts={inventoryParts}
              isSubmitting={isSubmitting}
              onServiceSelectionChange={setSelectedServiceCatalogItemIds}
              onManualPartIdChange={setManualPartId}
              onManualPartQuantityChange={setManualPartQuantity}
              onSendEstimate={handleApplyStatus}
              onStartRepair={handleStartRepair}
              onMarkCompleted={handleMarkCompleted}
              onAddSelectedServices={handleAddSelectedServices}
              onAddManualPart={handleAddManualPart}
              onRemovePart={handleRemovePart}
              onRemoveWorkItem={handleRemoveWorkItem}
              onUpdateWorkItem={handleUpdateWorkItem}
            />
          </div>
        </div>
      </section>
    </DashboardShell>
  )
}
