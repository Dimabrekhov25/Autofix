import type { BookingDto } from '../../../apis/bookingApi'
import type { CatalogPartDto, ServiceCatalogItemDto } from '../../../apis/catalogApi'
import type { ServiceOrderDto } from '../../../apis/serviceOrdersApi'
import { Button } from '../../../shared/ui/Button'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import {
  formatBookingDate,
  formatCurrency,
  getBookingCardSubtitle,
  getBookingCardTitle,
  getBookingServicesLabel,
  getServiceOrderStatusLabel,
  serviceOrderStatusOptions,
} from '../lib/service-order'

interface ServiceOrderDetailsPanelProps {
  booking: BookingDto | null
  serviceOrder: ServiceOrderDto | null
  isLoading: boolean
  errorMessage: string | null
  actionErrorMessage: string | null
  actionSuccessMessage: string | null
  selectedStatus: number
  selectedServiceCatalogItemIds: string[]
  manualPartId: string
  manualPartQuantity: string
  serviceCatalogItems: ServiceCatalogItemDto[]
  parts: CatalogPartDto[]
  isSubmitting: boolean
  onStatusChange: (value: number) => void
  onServiceSelectionChange: (ids: string[]) => void
  onManualPartIdChange: (value: string) => void
  onManualPartQuantityChange: (value: string) => void
  onApplyStatus: () => void
  onAddSelectedServices: () => void
  onAddManualPart: () => void
  onRemovePart: (partItemId: string) => void
}

export function ServiceOrderDetailsPanel({
  booking,
  serviceOrder,
  isLoading,
  errorMessage,
  actionErrorMessage,
  actionSuccessMessage,
  selectedStatus,
  selectedServiceCatalogItemIds,
  manualPartId,
  manualPartQuantity,
  serviceCatalogItems,
  parts,
  isSubmitting,
  onStatusChange,
  onServiceSelectionChange,
  onManualPartIdChange,
  onManualPartQuantityChange,
  onApplyStatus,
  onAddSelectedServices,
  onAddManualPart,
  onRemovePart,
}: ServiceOrderDetailsPanelProps) {
  if (!booking) {
    return (
      <section className="flex min-h-[32rem] items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-panel">
        <div>
          <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
            Service Order
          </p>
          <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-slate-900">
            Choose a booking from the queue
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            The right panel becomes the live mechanic workspace: update status, add repair services, reserve manual parts, and release parts when they are removed.
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

  const isCompleted = serviceOrder.status === 6

  return (
    <section className="space-y-6">
      <article className="rounded-[1.75rem] bg-slate-950 p-8 text-white shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-cyan-200">
              Live Service Order
            </p>
            <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight">
              {getBookingCardTitle(booking)}
            </h2>
            <p className="mt-2 text-sm text-slate-300">{getBookingCardSubtitle(booking)}</p>
            <p className="mt-2 text-sm text-slate-300">
              Booked: {getBookingServicesLabel(booking)} · {formatBookingDate(booking.startAt)}
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

        {booking.notes ? (
          <div className="mt-6 rounded-[1.25rem] bg-white/10 px-5 py-4 text-sm text-slate-200">
            {booking.notes}
          </div>
        ) : null}
      </article>

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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <div className="space-y-6">
          <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                  Work Items
                </p>
                <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
                  Repair plan
                </h3>
              </div>
              <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">
                {serviceOrder.workItems.length} items
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {serviceOrder.workItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm text-slate-500">
                  No work items yet. Add repair services below after diagnostics are complete.
                </div>
              ) : (
                serviceOrder.workItems.map((workItem) => (
                  <div key={workItem.id} className="rounded-2xl bg-slate-50 px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{workItem.description}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                          {workItem.laborHours.toFixed(2)}h · {formatCurrency(workItem.hourlyRate)}/hr
                        </p>
                      </div>
                      <span className="text-sm font-black text-slate-900">
                        {formatCurrency(workItem.lineTotal)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                  Reserved Parts
                </p>
                <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
                  Inventory impact
                </h3>
              </div>
              <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-black text-cyan-700">
                {serviceOrder.partItems.length} lines
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {serviceOrder.partItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm text-slate-500">
                  No reserved parts yet.
                </div>
              ) : (
                serviceOrder.partItems.map((partItem) => (
                  <div key={partItem.id} className="rounded-2xl bg-slate-50 px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{partItem.partName}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                          Qty {partItem.quantity} · {partItem.availability === 1 ? 'In Stock' : 'Back Order'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">
                          {formatCurrency(partItem.lineTotal)}
                        </p>
                        {!isCompleted ? (
                          <button
                            type="button"
                            onClick={() => onRemovePart(partItem.id)}
                            disabled={isSubmitting}
                            className="mt-2 inline-flex items-center gap-1 rounded-full bg-error/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-error transition-colors hover:bg-error/15 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <MaterialIcon name="delete" className="text-sm" />
                            <span>Release</span>
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
              Status
            </p>
            <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
              Update workflow state
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Completing the order converts the reserved parts into actual stock consumption.
            </p>

            <div className="mt-5 space-y-3">
              <select
                value={selectedStatus}
                onChange={(event) => onStatusChange(Number(event.target.value))}
                disabled={isCompleted}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {serviceOrderStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <Button type="button" onClick={onApplyStatus} disabled={isSubmitting || isCompleted}>
                {isSubmitting ? 'Saving...' : 'Apply Status'}
              </Button>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
              Add Services
            </p>
            <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
              Post-diagnostic work
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Adding a service here also reserves its required parts immediately.
            </p>

            <div className="mt-5 max-h-72 space-y-3 overflow-y-auto pr-1">
              {serviceCatalogItems.map((item) => {
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
                      disabled={isCompleted}
                      onChange={(event) => {
                        const nextIds = event.target.checked
                          ? [...selectedServiceCatalogItemIds, item.id]
                          : selectedServiceCatalogItemIds.filter((id) => id !== item.id)
                        onServiceSelectionChange(nextIds)
                      }}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                        {formatCurrency(item.basePrice + item.estimatedLaborCost)} · {item.requiredParts.length} required parts
                      </p>
                    </div>
                  </label>
                )
              })}
            </div>

            <div className="mt-5">
              <Button
                type="button"
                onClick={onAddSelectedServices}
                disabled={isSubmitting || isCompleted || selectedServiceCatalogItemIds.length === 0}
                className="w-full"
              >
                {isSubmitting ? 'Saving...' : 'Add Selected Services'}
              </Button>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-panel">
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
              Manual Part
            </p>
            <h3 className="mt-2 text-2xl font-headline font-extrabold tracking-tight text-slate-900">
              Edge-case inventory add
            </h3>
            <div className="mt-5 grid gap-4">
              <select
                value={manualPartId}
                onChange={(event) => onManualPartIdChange(event.target.value)}
                disabled={isCompleted}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <option value="">Select part</option>
                {parts.map((part) => (
                  <option key={part.id} value={part.id}>
                    {part.name} · {formatCurrency(part.unitPrice)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                step="1"
                value={manualPartQuantity}
                onChange={(event) => onManualPartQuantityChange(event.target.value)}
                disabled={isCompleted}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-70"
                placeholder="Quantity"
              />
              <Button
                type="button"
                onClick={onAddManualPart}
                disabled={isSubmitting || isCompleted || !manualPartId || !manualPartQuantity}
                className="w-full"
              >
                {isSubmitting ? 'Saving...' : 'Reserve Manual Part'}
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
