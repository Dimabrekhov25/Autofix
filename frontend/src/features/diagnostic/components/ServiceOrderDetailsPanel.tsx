import { useEffect, useState } from 'react'

import type { BookingDto } from '../../../apis/bookingApi'
import type { CatalogPartDto, ServiceCatalogItemDto } from '../../../apis/catalogApi'
import type { InventoryItemDto } from '../../../apis/inventoryApi'
import type { ServiceOrderDto } from '../../../apis/serviceOrdersApi'
import { formatBookingReference } from '../../booking/lib/booking-api-helpers'
import { Button } from '../../../shared/ui/Button'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import {
  formatBookingDate,
  formatCurrency,
  getBookingCardSubtitle,
  getBookingCardTitle,
  getBookingPaymentMethodLabel,
  getBookingSettlementLabel,
  getBookingServicesLabel,
  getServiceOrderStatusLabel,
} from '../lib/service-order'

interface ServiceOrderDetailsPanelProps {
  booking: BookingDto | null
  serviceOrder: ServiceOrderDto | null
  isLoading: boolean
  errorMessage: string | null
  actionErrorMessage: string | null
  actionSuccessMessage: string | null
  selectedServiceCatalogItemIds: string[]
  manualPartId: string
  manualPartQuantity: string
  serviceCatalogItems: ServiceCatalogItemDto[]
  inventoryParts: Array<CatalogPartDto & InventoryItemDto & { availableQuantity: number }>
  isSubmitting: boolean
  onServiceSelectionChange: (ids: string[]) => void
  onManualPartIdChange: (value: string) => void
  onManualPartQuantityChange: (value: string) => void
  onSendEstimate: () => void
  onStartRepair: () => void
  onMarkCompleted: () => void
  onAddSelectedServices: () => void
  onAddManualPart: () => void
  onRemovePart: (partItemId: string) => void
  onRemoveWorkItem: (workItemId: string) => void
  onUpdateWorkItem: (workItemId: string, servicePrice: number) => void
}

function getPrimaryActionLabel(status: number) {
  switch (status) {
    case 1:
      return 'Send Estimate To Customer'
    case 7:
      return 'Start Repair'
    case 3:
      return 'Mark Repair Completed'
    case 6:
      return 'Resend Updated Estimate'
    default:
      return 'No Action Available'
  }
}

function getWorkflowMessage(status: number) {
  switch (status) {
    case 1:
      return 'Estimate is still internal. Finish the work scope and send it to the customer dashboard.'
    case 2:
      return 'Estimate was sent. Wait for customer approval in the dashboard before starting the repair.'
    case 7:
      return 'Customer approved the estimate. Review the final approved scope and start the repair when the vehicle is ready to move into the bay.'
    case 3:
      return 'Repair is in progress and approved parts are already consumed from inventory.'
    case 4:
      return 'Repair is completed. This request is now part of service history.'
    case 5:
      return 'This request was cancelled. No further mechanic action is available.'
    case 6:
      return 'Customer requested changes. Update the estimate and send the revised version back to the dashboard.'
    default:
      return 'Manage this service order from this screen.'
  }
}

const inlineRemoveButtonClass =
  'inline-flex items-center gap-1 rounded-full bg-error/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-error transition-colors hover:bg-error/15 disabled:cursor-not-allowed disabled:opacity-60'

const compactSaveButtonClass = 'px-5 py-3 md:self-start'

function SectionCountBadge({
  value,
  label,
  tone,
}: {
  value: number
  label: string
  tone: 'primary' | 'cyan'
}) {
  const toneClassName = tone === 'primary'
    ? 'bg-gradient-to-br from-primary/15 via-primary/10 to-cyan-100 text-primary ring-primary/10'
    : 'bg-gradient-to-br from-cyan-100 via-sky-50 to-white text-cyan-700 ring-cyan-100'

  return (
    <div
      className={[
        'flex min-h-20 min-w-20 flex-col items-center justify-center rounded-[1.6rem] px-4 py-3 text-center shadow-sm ring-1',
        toneClassName,
      ].join(' ')}
    >
      <span className="font-headline text-2xl font-extrabold leading-none">{value}</span>
      <span className="mt-1 text-[0.7rem] font-black uppercase tracking-[0.18em]">{label}</span>
    </div>
  )
}

export function ServiceOrderDetailsPanel({
  booking,
  serviceOrder,
  isLoading,
  errorMessage,
  actionErrorMessage,
  actionSuccessMessage,
  selectedServiceCatalogItemIds,
  manualPartId,
  manualPartQuantity,
  serviceCatalogItems,
  inventoryParts,
  isSubmitting,
  onServiceSelectionChange,
  onManualPartIdChange,
  onManualPartQuantityChange,
  onSendEstimate,
  onStartRepair,
  onMarkCompleted,
  onAddSelectedServices,
  onAddManualPart,
  onRemovePart,
  onRemoveWorkItem,
  onUpdateWorkItem,
}: ServiceOrderDetailsPanelProps) {
  const [editingWorkItems, setEditingWorkItems] = useState<Record<string, { servicePrice: string }>>({})

  useEffect(() => {
    if (!serviceOrder) {
      setEditingWorkItems({})
      return
    }

    setEditingWorkItems(
      Object.fromEntries(
        serviceOrder.workItems.map((workItem) => [
          workItem.id,
          {
            servicePrice: workItem.lineTotal.toString(),
          },
        ]),
      ),
    )
  }, [serviceOrder])

  if (!booking) {
    return (
      <section className="flex min-h-[32rem] items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-panel">
        <div>
          <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
            Estimate Screen
          </p>
          <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-slate-900">
            Choose a booking from the list
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Review the intake note, build the estimate, and send it to the client dashboard only when the scope is clear.
          </p>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="rounded-[1.75rem] bg-white/90 p-8 shadow-panel">
        <p className="text-sm text-slate-500">Loading service order...</p>
      </section>
    )
  }

  if (errorMessage || !serviceOrder) {
    return (
      <section className="rounded-[1.75rem] border border-error/15 bg-error/5 p-6 shadow-panel">
        <p className="text-sm text-error">
          {errorMessage ?? 'Service order could not be loaded for this booking.'}
        </p>
      </section>
    )
  }

  const isLocked = serviceOrder.status === 2 || serviceOrder.status === 7 || serviceOrder.status === 3 || serviceOrder.status === 4 || serviceOrder.status === 5
  const canSendEstimate = (serviceOrder.status === 1 || serviceOrder.status === 6)
    && (serviceOrder.workItems.length > 0 || serviceOrder.partItems.length > 0)
  const canStartRepair = serviceOrder.status === 7
  const canMarkCompleted = serviceOrder.status === 3
  const requestedServiceNames = booking.services.map((service) => service.name).join(', ')
  const existingWorkItemDescriptions = new Set(
    serviceOrder.workItems.map((workItem) => workItem.description.trim().toLowerCase()).filter(Boolean),
  )
  const addableServiceCatalogItems = serviceCatalogItems.filter(
    (item) => !existingWorkItemDescriptions.has(item.name.trim().toLowerCase()),
  )
  const totalPartQuantity = serviceOrder.partItems.reduce((total, item) => total + item.quantity, 0)
  const getMinimumServicePrice = (description: string) => {
    const normalizedDescription = description.trim().toLowerCase()

    const catalogPrice = serviceCatalogItems.find(
      (item) => item.name.trim().toLowerCase() === normalizedDescription,
    )?.basePrice

    if (typeof catalogPrice === 'number') {
      return catalogPrice
    }

    return booking.services.find(
      (service) => service.name.trim().toLowerCase() === normalizedDescription,
    )?.basePrice ?? 0
  }

  return (
    <section className="space-y-6">
      <article className="rounded-[1.75rem] bg-slate-950 p-8 text-white shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-cyan-200">
              Mechanic Estimate Desk
            </p>
            <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight">
              {getBookingCardTitle(booking)}
            </h2>
            <p className="mt-2 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-cyan-200">
              Request #{formatBookingReference(booking.id)}
            </p>
            <p className="mt-2 text-sm text-slate-300">{getBookingCardSubtitle(booking)}</p>
            <p className="mt-2 text-sm text-slate-300">
              Booked: {getBookingServicesLabel(booking)} | {formatBookingDate(booking.startAt)}
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white/10 px-5 py-4">
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-300">
              Current Status
            </p>
            <p className="mt-2 text-xl font-bold text-white">
              {getServiceOrderStatusLabel(serviceOrder.status)}
            </p>
          </div>
        </div>
      </article>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-panel">
          <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
            Step 1
          </p>
          <h3 className="mt-2 font-headline text-xl font-extrabold tracking-tight text-slate-900">
            Intake
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Review the customer complaint and the originally booked service before creating the repair plan.
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-panel">
          <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
            Step 2
          </p>
          <h3 className="mt-2 font-headline text-xl font-extrabold tracking-tight text-slate-900">
            Estimate
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Add the labor lines and the exact parts this vehicle needs from real inventory.
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-panel">
          <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
            Step 3
          </p>
          <h3 className="mt-2 font-headline text-xl font-extrabold tracking-tight text-slate-900">
            Client Approval
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Send the estimate to the dashboard. After the client approves it, the mechanic still starts the repair manually.
          </p>
        </article>
      </div>

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

      <div className="rounded-[1.5rem] border border-cyan-200 bg-cyan-50 px-6 py-5 shadow-panel">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-cyan-700">
            <MaterialIcon name="receipt_long" className="text-2xl" />
          </div>
          <div>
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-cyan-700">
              Client Estimate
            </p>
            <p className="mt-2 text-base font-bold text-slate-900">
              Everything added here goes to the customer dashboard estimate.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Add repair services, add required parts, and adjust the service price when the job is more complex than the standard starting price.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
        <div className="space-y-6">
          <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                  Intake Brief
                </p>
                <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
                  Reported issue and booking scope
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-700">
                Arrival info
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-5 py-4">
                <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                  Customer booked
                </p>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {requestedServiceNames || 'No service selected'}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-5 py-4">
                <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                  Customer complaint
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {booking.notes?.trim()
                    ? booking.notes
                    : 'No additional issue was written by the customer.'}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                  Estimate Services
                </p>
                <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
                  Services included in the estimate
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Add any service the mechanic will actually perform. Then adjust the final service price below if complexity makes the job more expensive than the starting price.
                </p>
              </div>
              <SectionCountBadge
                value={serviceOrder.workItems.length}
                label="Items"
                tone="primary"
              />
            </div>

            <div className="mt-5 space-y-4">
              {serviceOrder.workItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm text-slate-500">
                  No work items yet. Add repair services below after the vehicle inspection.
                </div>
              ) : (
                serviceOrder.workItems.map((workItem) => {
                  const editingState = editingWorkItems[workItem.id] ?? {
                    servicePrice: workItem.lineTotal.toString(),
                  }
                  const minimumServicePrice = getMinimumServicePrice(workItem.description)

                  return (
                    <div key={workItem.id} className="rounded-2xl bg-slate-50 px-5 py-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{workItem.description}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                            Current total {formatCurrency(workItem.lineTotal)}
                          </p>
                        </div>
                        {!isLocked ? (
                          <button
                            type="button"
                            onClick={() => onRemoveWorkItem(workItem.id)}
                            disabled={isSubmitting}
                            className={inlineRemoveButtonClass}
                          >
                            <MaterialIcon name="delete" className="text-sm" />
                            <span>Remove</span>
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
                        <div className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                            Service Price
                          </span>
                          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                            <input
                              type="number"
                              min={minimumServicePrice || 0}
                              step="0.01"
                              value={editingState.servicePrice}
                              disabled={isLocked}
                              onChange={(event) => {
                                setEditingWorkItems((current) => ({
                                  ...current,
                                  [workItem.id]: {
                                    servicePrice: event.target.value,
                                  },
                                }))
                              }}
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                              placeholder="Final service price"
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                const servicePrice = Number.parseFloat(editingState.servicePrice)
                                if (!Number.isFinite(servicePrice) || servicePrice < minimumServicePrice) {
                                  return
                                }

                                onUpdateWorkItem(workItem.id, servicePrice)
                              }}
                              disabled={isSubmitting || isLocked}
                              className={compactSaveButtonClass}
                            >
                              Save
                            </Button>
                          </div>
                          <span className="block text-xs text-slate-500">
                            Minimum from {formatCurrency(minimumServicePrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                  Parts
                </p>
                <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
                  Estimate parts list
                </h3>
              </div>
              <SectionCountBadge
                value={totalPartQuantity}
                label="Parts"
                tone="cyan"
              />
            </div>

            <div className="mt-5 space-y-4">
              {serviceOrder.partItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm text-slate-500">
                  No parts added to the estimate yet.
                </div>
              ) : (
                serviceOrder.partItems.map((partItem) => (
                  <div key={partItem.id} className="rounded-2xl bg-slate-50 px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{partItem.partName}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                          Qty {partItem.quantity} | {partItem.availability === 1 ? 'In Stock' : 'Back Order'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">
                          {formatCurrency(partItem.lineTotal)}
                        </p>
                        {!isLocked ? (
                          <button
                            type="button"
                            onClick={() => onRemovePart(partItem.id)}
                            disabled={isSubmitting}
                            className={`mt-2 ${inlineRemoveButtonClass}`}
                          >
                            <MaterialIcon name="delete" className="text-sm" />
                            <span>Remove</span>
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
              Publish And Repair
            </p>
            <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
              Mechanic actions
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The estimate must be sent to the customer dashboard first. Inventory is consumed only when the mechanic starts the approved repair.
            </p>

            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
              {getWorkflowMessage(serviceOrder.status)}
            </div>

            <div className="mt-5 space-y-3">
              {(serviceOrder.status === 1 || serviceOrder.status === 6) ? (
                <Button
                  type="button"
                  onClick={onSendEstimate}
                  disabled={isSubmitting || !canSendEstimate}
                  className="w-full"
                >
                  {isSubmitting ? 'Saving...' : getPrimaryActionLabel(serviceOrder.status)}
                </Button>
              ) : null}

              {serviceOrder.status === 2 ? (
                <Button
                  type="button"
                  tone="secondary"
                  disabled
                  className="w-full"
                >
                  Waiting For Customer Approval
                </Button>
              ) : null}

              {canStartRepair ? (
                <Button
                  type="button"
                  onClick={onStartRepair}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Saving...' : getPrimaryActionLabel(serviceOrder.status)}
                </Button>
              ) : null}

              {canMarkCompleted ? (
                <Button
                  type="button"
                  onClick={onMarkCompleted}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Saving...' : getPrimaryActionLabel(serviceOrder.status)}
                </Button>
              ) : null}

              {(serviceOrder.status === 1 || serviceOrder.status === 6) && !canSendEstimate ? (
                <p className="text-sm text-slate-500">
                  Add at least one labor line or one part before sending the estimate to the customer.
                </p>
              ) : null}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
              Payment Setup
            </p>
            <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
              Workshop handoff
            </h3>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                  Payment method
                </p>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {getBookingPaymentMethodLabel(booking.paymentOption)}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                  Settlement status
                </p>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {getBookingSettlementLabel(booking)}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
              Add Services
            </p>
            <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
              Add service to estimate
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              If the customer wants extra work or inspection reveals more issues, add those services here. They will appear in the client estimate and can be repriced in the service list above.
            </p>

            <div className="mt-5 max-h-72 space-y-3 overflow-y-auto pr-1">
              {addableServiceCatalogItems.map((item) => {
                const isSelected = selectedServiceCatalogItemIds.includes(item.id)

                return (
                  <label
                    key={item.id}
                    className={[
                      'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 bg-slate-50 hover:border-primary/25 hover:bg-white',
                    ].join(' ')}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isLocked}
                      onChange={(event) => {
                        const nextIds = event.target.checked
                          ? Array.from(new Set([...selectedServiceCatalogItemIds, item.id]))
                          : selectedServiceCatalogItemIds.filter((id) => id !== item.id)
                        onServiceSelectionChange(nextIds)
                      }}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                        Starts at {formatCurrency(item.basePrice)} | {item.estimatedDuration}
                      </p>
                    </div>
                  </label>
                )
              })}
              {addableServiceCatalogItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm text-slate-500">
                  All catalog services already exist in this estimate. Adjust the existing lines above if pricing or scope changed.
                </div>
              ) : null}

            </div>

            <div className="mt-5">
              <Button
                type="button"
                onClick={onAddSelectedServices}
                disabled={isSubmitting || isLocked || selectedServiceCatalogItemIds.length === 0 || addableServiceCatalogItems.length === 0}
                className="w-full"
              >
                {isSubmitting ? 'Saving...' : 'Add Selected Services To Estimate'}
              </Button>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
              Add Part
            </p>
            <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
              Add part to estimate
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add only the parts that will actually be used for this vehicle. These lines also go to the customer estimate.
            </p>
            <div className="mt-5 grid gap-4">
              <select
                value={manualPartId}
                onChange={(event) => onManualPartIdChange(event.target.value)}
                disabled={isLocked}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <option value="">Select inventory part</option>
                {inventoryParts.map((part) => (
                  <option key={part.partId} value={part.partId}>
                    {part.name} | {formatCurrency(part.unitPrice)} | available {part.availableQuantity}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                step="1"
                value={manualPartQuantity}
                onChange={(event) => onManualPartQuantityChange(event.target.value)}
                disabled={isLocked}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-70"
                placeholder="Quantity"
              />
              <Button
                type="button"
                onClick={onAddManualPart}
                disabled={isSubmitting || isLocked || !manualPartId || !manualPartQuantity}
                className="w-full"
              >
                {isSubmitting ? 'Saving...' : 'Add Part To Estimate'}
              </Button>
            </div>
          </article>

          <article className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-card">
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-300">
              Cost Snapshot
            </p>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Labor estimate</span>
                <span className="font-black text-white">{formatCurrency(serviceOrder.estimatedLaborCost)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Parts estimate</span>
                <span className="font-black text-white">{formatCurrency(serviceOrder.estimatedPartsCost)}</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Estimated total</span>
                <span className="text-2xl font-headline font-extrabold text-white">
                  {formatCurrency(serviceOrder.estimatedTotalCost)}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
