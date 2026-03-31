import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { APP_ROUTES } from '../../shared/config/routes'
import { Button } from '../../shared/ui/Button'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

const inventoryCategoryOptions = [
  'Brakes',
  'Engine',
  'Suspension',
  'Drivetrain',
  'Electrical',
  'Fuel System',
] as const

export function InventoryAddPartPage() {
  const navigate = useNavigate()
  const [imageLabel, setImageLabel] = useState('PNG, JPG or WebP (max. 5MB)')

  function handleBack() {
    if (window.history.state?.idx > 0) {
      navigate(-1)
      return
    }

    navigate(APP_ROUTES.inventory)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(APP_ROUTES.inventory)
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    setImageLabel(file ? file.name : 'PNG, JPG or WebP (max. 5MB)')
  }

  return (
    <DashboardShell searchPlaceholder="Search components...">
      <section className="relative overflow-hidden pb-8 pt-2">
        <div className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-primary/5 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-secondary/5 blur-[100px]" />

        <div className="relative max-w-5xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                to={APP_ROUTES.inventory}
                className="font-headline font-bold tracking-tight text-slate-900 transition-colors hover:text-primary"
              >
                Inventory
              </Link>
              <span className="text-slate-300">/</span>
              <span className="font-medium text-slate-500">Add New Part</span>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-primary/30 hover:text-primary"
            >
              <MaterialIcon name="arrow_back" className="text-lg" />
              <span>Back</span>
            </button>
          </div>

          <div className="mb-10 space-y-3">
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[0.6875rem] font-black uppercase tracking-[0.24em] text-primary">
              Internal Ops
            </span>
            <div>
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                New Component Entry
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-on-surface-variant sm:text-base">
                Register high-performance parts into the inventory catalog. Keep
                technical specs, stock inputs, and compatibility details in one place.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-surface-container-lowest shadow-panel">
            <form className="space-y-8 p-6 sm:p-8 lg:p-10" onSubmit={handleSubmit}>
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 md:col-span-4">
                  <h2 className="mb-1 font-headline text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
                    Identity
                  </h2>
                  <p className="text-xs leading-6 text-on-surface-variant">
                    General part identification and manufacturer details.
                  </p>
                </div>
                <div className="col-span-12 space-y-6 md:col-span-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="block pl-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                        Part Name
                      </span>
                      <input
                        type="text"
                        placeholder="e.g., Ceramic Brake Pads"
                        className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="block pl-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                        SKU / Part Number
                      </span>
                      <input
                        type="text"
                        placeholder="PA-7702-BRK"
                        className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30"
                      />
                    </label>
                  </div>

                  <label className="space-y-2">
                    <span className="block pl-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                      Category
                    </span>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-xl border-none bg-surface-container-low px-4 py-3 pr-12 text-sm text-slate-900 focus:ring-2 focus:ring-primary/30">
                        {inventoryCategoryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <MaterialIcon
                        name="expand_more"
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 md:col-span-4">
                  <h2 className="mb-1 font-headline text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
                    Logistics
                  </h2>
                  <p className="text-xs leading-6 text-on-surface-variant">
                    Inventory levels and unit price settings.
                  </p>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="block pl-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                        Initial Stock Level
                      </span>
                      <input
                        type="number"
                        min="0"
                        defaultValue="0"
                        className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-primary/30"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="block pl-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                        Unit Price ($)
                      </span>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                          $
                        </span>
                        <input
                          type="text"
                          placeholder="0.00"
                          className="w-full rounded-xl border-none bg-surface-container-low py-3 pl-8 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 md:col-span-4">
                  <h2 className="mb-1 font-headline text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
                    Specifications
                  </h2>
                  <p className="text-xs leading-6 text-on-surface-variant">
                    Vehicle compatibility and technical descriptions.
                  </p>
                </div>
                <div className="col-span-12 space-y-6 md:col-span-8">
                  <label className="space-y-2">
                    <span className="block pl-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                      Compatibility
                    </span>
                    <textarea
                      rows={3}
                      placeholder="BMW M3 (G80), M4 (G82) 2021-2024..."
                      className="w-full resize-none rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="block pl-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                      Description
                    </span>
                    <textarea
                      rows={4}
                      placeholder="Full ceramic composite brake pads designed for high-thermal endurance..."
                      className="w-full resize-none rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30"
                    />
                  </label>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 md:col-span-4">
                  <h2 className="mb-1 font-headline text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
                    Media Assets
                  </h2>
                  <p className="text-xs leading-6 text-on-surface-variant">
                    Upload a product image for catalog and technician reference.
                  </p>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <label className="group flex cursor-pointer flex-col items-center rounded-[1.25rem] border-2 border-dashed border-slate-200 px-6 py-10 text-center transition-colors hover:bg-slate-50">
                    <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-primary/10">
                      <MaterialIcon
                        name="cloud_upload"
                        className="text-slate-400 transition-colors group-hover:text-primary"
                      />
                    </div>
                    <p className="text-sm font-bold text-slate-900">Click to upload image</p>
                    <p className="mt-1 text-xs text-on-surface-variant">{imageLabel}</p>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-400">
                  <MaterialIcon name="lock" className="text-sm" />
                  <span>Secure Entry System</span>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <Button to={APP_ROUTES.inventory} tone="secondary" className="px-6 py-3 text-sm">
                    Cancel
                  </Button>
                  <Button type="submit" className="px-7 py-3 text-sm shadow-lg shadow-primary/20">
                    Add to Inventory
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </DashboardShell>
  )
}
