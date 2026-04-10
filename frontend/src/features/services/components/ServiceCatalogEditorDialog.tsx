import type { FormEvent } from 'react'

import type { ServiceCatalogItemDto } from '../../../apis/catalogApi'
import { Button } from '../../../shared/ui/Button'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import { SelectField } from '../../../shared/ui/SelectField'
import type { ServiceCatalogFormState } from '../lib/serviceCatalog'

interface ServiceCatalogEditorDialogProps {
  editingItem: ServiceCatalogItemDto | null
  form: ServiceCatalogFormState
  isSubmitting: boolean
  errorMessage: string | null
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onChange: (updater: (current: ServiceCatalogFormState) => ServiceCatalogFormState) => void
}

export function ServiceCatalogEditorDialog({
  editingItem,
  form,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
  onChange,
}: ServiceCatalogEditorDialogProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[calc(100vh-4rem)] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
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
                placeholder="Explain what is covered and what the client should expect."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-800">Category</span>
              <SelectField
                value={form.category}
                onChange={(event) =>
                  onChange((current) => ({
                    ...current,
                    category: event.target.value as ServiceCatalogFormState['category'],
                  }))
                }
                className="rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/10"
                iconClassName="text-slate-400"
              >
                <option value="service">Service</option>
                <option value="diagnostic">Diagnostic</option>
              </SelectField>
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

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-bold text-slate-800">Starting Price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.basePrice}
                onChange={(event) => onChange((current) => ({ ...current, basePrice: event.target.value }))}
                placeholder="40"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
              <p className="text-xs text-slate-500">
                This is the only public service price. The client sees it as a starting price, and exact parts are added later by the mechanic after inspection.
              </p>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 md:col-span-2">
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

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-6">
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
              Service Pricing Rule
            </p>
            <h3 className="mt-2 text-xl font-headline font-bold text-slate-900">
              No parts are attached to the catalog item
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              The catalog item only stores the job itself and its starting labor price. Parts are chosen later by the mechanic inside diagnostics, after the vehicle inspection.
            </p>
          </div>

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
