import type { FormEvent } from 'react'

import type { ServiceCatalogItemDto } from '../../../apis/catalogApi'
import { Button } from '../../../shared/ui/Button'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import {
  createRequiredPartFormItem,
  formatCurrency,
  type InventoryPartOption,
  type ServiceCatalogFormState,
} from '../lib/serviceCatalog'

interface ServiceCatalogEditorDialogProps {
  editingItem: ServiceCatalogItemDto | null
  inventoryParts: InventoryPartOption[]
  form: ServiceCatalogFormState
  isSubmitting: boolean
  errorMessage: string | null
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onChange: (updater: (current: ServiceCatalogFormState) => ServiceCatalogFormState) => void
}

export function ServiceCatalogEditorDialog({
  editingItem,
  inventoryParts,
  form,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
  onChange,
}: ServiceCatalogEditorDialogProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[calc(100vh-4rem)] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-8 py-6 backdrop-blur">
          <div>
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
              {editingItem ? 'Edit Catalog Item' : 'New Catalog Item'}
            </p>
            <h2 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-slate-900">
              {editingItem ? editingItem.name : 'Create a service or diagnostic'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-3 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-8 px-8 py-8">
          {errorMessage ? (
            <div className="rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-bold text-slate-800">Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => onChange((current) => ({ ...current, name: event.target.value }))}
                placeholder="Brake overhaul package"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-bold text-slate-800">Description</span>
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) => onChange((current) => ({ ...current, description: event.target.value }))}
                placeholder="Explain what is covered, how the mechanic uses it, and what the client should expect."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-800">Category</span>
              <select
                value={form.category}
                onChange={(event) =>
                  onChange((current) => ({
                    ...current,
                    category: event.target.value as ServiceCatalogFormState['category'],
                    requiredParts: event.target.value === 'service' ? current.requiredParts : [],
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              >
                <option value="service">Service</option>
                <option value="diagnostic">Diagnostic</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-800">Estimated Duration</span>
              <input
                type="text"
                value={form.estimatedDuration}
                onChange={(event) =>
                  onChange((current) => ({ ...current, estimatedDuration: event.target.value }))
                }
                placeholder="01:30:00"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-800">Base Price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.basePrice}
                onChange={(event) => onChange((current) => ({ ...current, basePrice: event.target.value }))}
                placeholder="250"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-800">Estimated Labor Cost</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.estimatedLaborCost}
                onChange={(event) =>
                  onChange((current) => ({ ...current, estimatedLaborCost: event.target.value }))
                }
                placeholder="180"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => onChange((current) => ({ ...current, isActive: event.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
              />
              <div>
                <p className="text-sm font-bold text-slate-800">Active catalog item</p>
                <p className="text-xs text-slate-500">Inactive items stay in history but disappear from booking.</p>
              </div>
            </label>
          </div>

          <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                  Required Parts
                </p>
                <h3 className="mt-2 text-xl font-headline font-bold text-slate-900">
                  {form.category === 'service'
                    ? 'Reserve these parts automatically on booking'
                    : 'Diagnostics do not reserve parts'}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Use this only for fixed services. The selector below is bound to inventory items only, so you can reserve only stocked parts.
                </p>
              </div>

              <Button
                type="button"
                tone="secondary"
                onClick={() =>
                onChange((current) => ({
                    ...current,
                    requiredParts: [...current.requiredParts, createRequiredPartFormItem()],
                  }))
                }
                disabled={form.category !== 'service' || inventoryParts.length === 0}
                className="px-5 py-3 text-sm"
              >
                <MaterialIcon name="add" className="text-base" />
                <span>Add Part</span>
              </Button>
            </div>

            {form.category !== 'service' ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                This catalog item is diagnostic-only. Required parts are intentionally disabled.
              </div>
              ) : inventoryParts.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-6 text-sm text-amber-800">
                  No inventory items are available yet. Add the part to inventory first, then it can be attached to a service template.
                </div>
              ) : form.requiredParts.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-6 text-sm text-slate-500">
                  No required parts configured. Booking this service will reserve zero parts until a mechanic adds them manually later.
                </div>
            ) : (
              <div className="mt-5 space-y-4">
                {form.requiredParts.map((requiredPart) => (
                  <div
                    key={requiredPart.id}
                    className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[minmax(0,1fr)_10rem_auto]"
                  >
                    <label className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Inventory Item
                      </span>
                      <select
                        value={requiredPart.partId}
                        onChange={(event) =>
                          onChange((current) => ({
                            ...current,
                            requiredParts: current.requiredParts.map((item) =>
                              item.id === requiredPart.id
                                ? { ...item, partId: event.target.value }
                                : item,
                            ),
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                      >
                        <option value="">Select part</option>
                        {inventoryParts.map((part) => (
                          <option key={part.inventoryItemId} value={part.partId}>
                            {part.partName} · {formatCurrency(part.unitPrice)} · available {part.availableQuantity}
                          </option>
                        ))}
                      </select>
                      {requiredPart.partId ? (
                        (() => {
                          const selectedInventoryPart = inventoryParts.find((part) => part.partId === requiredPart.partId)
                          return selectedInventoryPart ? (
                            <p className="text-xs text-slate-500">
                              On hand {selectedInventoryPart.quantityOnHand} · reserved {selectedInventoryPart.reservedQuantity} · available {selectedInventoryPart.availableQuantity}
                            </p>
                          ) : (
                            <p className="text-xs text-amber-700">
                              This part is not currently present in inventory.
                            </p>
                          )
                        })()
                      ) : null}
                    </label>

                    <label className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Quantity
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={requiredPart.quantity}
                        onChange={(event) =>
                          onChange((current) => ({
                            ...current,
                            requiredParts: current.requiredParts.map((item) =>
                              item.id === requiredPart.id
                                ? { ...item, quantity: event.target.value }
                                : item,
                            ),
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                      />
                    </label>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() =>
                          onChange((current) => ({
                            ...current,
                            requiredParts: current.requiredParts.filter((item) => item.id !== requiredPart.id),
                          }))
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm font-bold text-error transition-colors hover:bg-error/15"
                      >
                        <MaterialIcon name="delete" className="text-base" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" tone="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Catalog Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
