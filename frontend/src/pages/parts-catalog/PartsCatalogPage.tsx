import { useState } from 'react'

import { APP_ROUTES } from '../../shared/config/routes'
import { Button } from '../../shared/ui/Button'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

type PartCategory =
  | 'Braking'
  | 'Powertrain'
  | 'Electronics'
  | 'Suspension'
  | 'Performance'

interface CatalogPart {
  id: string
  name: string
  sku: string
  category: PartCategory
  compatibility: string[]
  price: number
  note: string
}

const catalogParts: CatalogPart[] = [
  {
    id: 'PA-BK-992-01',
    name: 'Titanium Brake Rotor Set',
    sku: 'RT-992-GT3-CCB',
    category: 'Braking',
    compatibility: ['Porsche 911 (992)', 'GT3 RS'],
    price: 4850,
    note: 'MSRP fixed',
  },
  {
    id: 'PA-PW-BW-EFR71',
    name: 'BorgWarner EFR Turbo',
    sku: 'BW-EFR-7163-B',
    category: 'Powertrain',
    compatibility: ['BMW M2 (G87)', 'BMW M3 (G80)'],
    price: 2415,
    note: 'Dealer cost',
  },
  {
    id: 'PA-EL-MOT-M150',
    name: 'MoTeC M150 Standalone ECU',
    sku: 'MOT-M150-UNL',
    category: 'Electronics',
    compatibility: ['Universal Platform'],
    price: 3980,
    note: 'Custom quote',
  },
  {
    id: 'PA-SS-OHL-TTX',
    name: 'Ohlins TTX Coilovers',
    sku: 'OHL-TTX-36-40',
    category: 'Suspension',
    compatibility: ['McLaren 720S', 'McLaren 650S'],
    price: 8700,
    note: 'Stock ready',
  },
  {
    id: 'PA-PF-AKR-EVO',
    name: 'Akrapovic Evolution Exhaust',
    sku: 'AKR-G82-TI-EVO',
    category: 'Performance',
    compatibility: ['BMW M4 (G82)', 'BMW M3 (G80)'],
    price: 6290,
    note: 'Limited batch',
  },
  {
    id: 'PA-BK-END-01',
    name: 'Endless Race Pad Kit',
    sku: 'END-MCL-CCR',
    category: 'Braking',
    compatibility: ['McLaren 765LT', 'McLaren 720S'],
    price: 1290,
    note: 'Track spec',
  },
]

const categoryOptions: Array<'all' | PartCategory> = [
  'all',
  'Braking',
  'Powertrain',
  'Electronics',
  'Suspension',
  'Performance',
]

const priceRangeOptions = [
  { value: 'all', label: 'Any Price' },
  { value: '0-2500', label: '$0 - $2,500' },
  { value: '2500-5000', label: '$2,500 - $5,000' },
  { value: '5000-10000', label: '$5,000 - $10,000' },
  { value: '10000+', label: '$10,000+' },
] as const

const categoryBadgeClassNames: Record<PartCategory, string> = {
  Braking: 'bg-primary/10 text-primary',
  Powertrain: 'bg-tertiary/10 text-tertiary',
  Electronics: 'bg-secondary/10 text-secondary',
  Suspension: 'bg-amber-100 text-amber-700',
  Performance: 'bg-emerald-100 text-emerald-700',
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

function matchesPriceRange(price: number, range: (typeof priceRangeOptions)[number]['value']) {
  if (range === 'all') return true
  if (range === '0-2500') return price <= 2500
  if (range === '2500-5000') return price > 2500 && price <= 5000
  if (range === '5000-10000') return price > 5000 && price <= 10000
  return price > 10000
}

export function PartsCatalogPage() {
  const [searchValue, setSearchValue] = useState('')
  const [categoryValue, setCategoryValue] = useState<(typeof categoryOptions)[number]>('all')
  const [priceRangeValue, setPriceRangeValue] =
    useState<(typeof priceRangeOptions)[number]['value']>('all')
  const [compatibilityValue, setCompatibilityValue] = useState('')

  const normalizedSearch = searchValue.trim().toLowerCase()
  const normalizedCompatibility = compatibilityValue.trim().toLowerCase()

  const filteredParts = catalogParts.filter((part) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      part.name.toLowerCase().includes(normalizedSearch) ||
      part.id.toLowerCase().includes(normalizedSearch) ||
      part.sku.toLowerCase().includes(normalizedSearch)

    const matchesCategory = categoryValue === 'all' || part.category === categoryValue
    const matchesPrice = matchesPriceRange(part.price, priceRangeValue)
    const matchesCompatibility =
      normalizedCompatibility.length === 0 ||
      part.compatibility.some((item) => item.toLowerCase().includes(normalizedCompatibility))

    return matchesSearch && matchesCategory && matchesPrice && matchesCompatibility
  })

  const totalValue = catalogParts.reduce((sum, part) => sum + part.price, 0)

  return (
    <DashboardShell searchPlaceholder="Search components, part numbers, or vehicles...">
      <section className="relative overflow-hidden pb-10 pt-2">
        <div className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-tertiary/10 blur-[100px]" />

        <div className="relative">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[0.6875rem] font-black uppercase tracking-[0.24em] text-primary">
                Internal Ops
              </span>
              <div>
                <h1 className="font-headline text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                  Parts Catalog
                </h1>
                <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-on-surface-variant sm:text-base">
                  Comprehensive repository of master components and technical
                  specifications for workshop operations.
                </p>
              </div>
            </div>

            <Button to={APP_ROUTES.inventoryAddPart} className="px-6 py-3 text-sm shadow-lg shadow-primary/20">
              <MaterialIcon name="add_circle" className="text-lg" />
              <span>Add New Part</span>
            </Button>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total SKU's" value={catalogParts.length.toLocaleString('en-US')} accent="border-primary" />
            <MetricCard label="Active Suppliers" value="48" accent="border-tertiary" />
            <MetricCard label="Backordered" value="156" accent="border-secondary" />
            <MetricCard
              label="Catalog Value"
              value={formatCurrency(totalValue)}
              accent="border-slate-300"
            />
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-surface-container-lowest shadow-panel">
            <div className="border-b border-slate-100 bg-slate-50/70 p-6">
              <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
                <label className="space-y-2">
                  <span className="block pl-1 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                    Search
                  </span>
                  <div className="relative">
                    <MaterialIcon
                      name="search"
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                      placeholder="Part name, ID, or SKU"
                      className="w-full rounded-xl border-none bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="block pl-1 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                    Part Category
                  </span>
                  <div className="relative">
                    <select
                      value={categoryValue}
                      onChange={(event) =>
                        setCategoryValue(event.target.value as (typeof categoryOptions)[number])
                      }
                      className="w-full appearance-none rounded-xl border-none bg-white px-4 py-3 pr-11 text-sm font-medium text-slate-900 shadow-sm focus:ring-2 focus:ring-primary/20"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option === 'all' ? 'All Categories' : option}
                        </option>
                      ))}
                    </select>
                    <MaterialIcon
                      name="expand_more"
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="block pl-1 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                    Price Range
                  </span>
                  <div className="relative">
                    <select
                      value={priceRangeValue}
                      onChange={(event) =>
                        setPriceRangeValue(
                          event.target.value as (typeof priceRangeOptions)[number]['value'],
                        )
                      }
                      className="w-full appearance-none rounded-xl border-none bg-white px-4 py-3 pr-11 text-sm font-medium text-slate-900 shadow-sm focus:ring-2 focus:ring-primary/20"
                    >
                      {priceRangeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <MaterialIcon
                      name="expand_more"
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="block pl-1 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                    Compatibility
                  </span>
                  <input
                    type="text"
                    value={compatibilityValue}
                    onChange={(event) => setCompatibilityValue(event.target.value)}
                    placeholder="e.g. Porsche, M-Series"
                    className="w-full rounded-xl border-none bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchValue('')
                      setCategoryValue('all')
                      setPriceRangeValue('all')
                      setCompatibilityValue('')
                    }}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-surface-container px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-surface-container-high xl:w-auto"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Part Name and ID
                    </th>
                    <th className="px-6 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Category
                    </th>
                    <th className="px-6 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Compatibility
                    </th>
                    <th className="px-6 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Unit Price
                    </th>
                    <th className="px-8 py-4 text-right text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredParts.map((part) => (
                    <tr key={part.id} className="group transition-colors hover:bg-slate-50/80">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                            <MaterialIcon name="precision_manufacturing" className="text-xl" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{part.name}</p>
                            <p className="text-xs font-medium text-slate-400">ID: {part.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-slate-600">{part.sku}</td>
                      <td className="px-6 py-5">
                        <span
                          className={[
                            'inline-flex rounded-full px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.16em]',
                            categoryBadgeClassNames[part.category],
                          ].join(' ')}
                        >
                          {part.category}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {part.compatibility.map((item) => (
                            <span
                              key={item}
                              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-900">{formatCurrency(part.price)}</p>
                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-slate-400">
                          {part.note}
                        </p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                          <button
                            type="button"
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary/5 hover:text-primary"
                            aria-label={`Edit ${part.name}`}
                          >
                            <MaterialIcon name="edit" className="text-lg" />
                          </button>
                          <button
                            type="button"
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-error/5 hover:text-error"
                            aria-label={`Delete ${part.name}`}
                          >
                            <MaterialIcon name="delete" className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-8 py-4">
              <p className="text-xs font-medium text-slate-500">
                Showing {filteredParts.length} of {catalogParts.length} master parts
              </p>
              <div className="flex items-center gap-1">
                <PaginationButton icon="chevron_left" muted />
                <PaginationNumber active>1</PaginationNumber>
                <PaginationNumber>2</PaginationNumber>
                <PaginationNumber>3</PaginationNumber>
                <span className="px-1 text-slate-300">...</span>
                <PaginationNumber>24</PaginationNumber>
                <PaginationButton icon="chevron_right" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 opacity-60">
            <div className="flex flex-wrap gap-4">
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-slate-500">
                Catalog Version 4.2.0
              </span>
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-slate-500">
                Last Sync: 12m ago
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MaterialIcon name="verified" className="text-sm text-slate-500" />
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-slate-500">
                Enterprise Secured Dataset
              </span>
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  )
}

interface MetricCardProps {
  label: string
  value: string
  accent: string
}

function MetricCard({ label, value, accent }: MetricCardProps) {
  return (
    <div
      className={[
        'rounded-2xl border border-white/80 bg-white p-6 shadow-panel',
        'border-l-4',
        accent,
      ].join(' ')}
    >
      <p className="mb-1 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>
      <p className="font-headline text-3xl font-black text-slate-900">{value}</p>
    </div>
  )
}

interface PaginationButtonProps {
  icon: string
  muted?: boolean
}

function PaginationButton({ icon, muted = false }: PaginationButtonProps) {
  return (
    <button
      type="button"
      className={[
        'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
        muted ? 'text-slate-400 hover:bg-slate-100' : 'text-slate-600 hover:bg-slate-100',
      ].join(' ')}
      aria-label={icon}
    >
      <MaterialIcon name={icon} className="text-sm" />
    </button>
  )
}

function PaginationNumber({
  children,
  active = false,
}: {
  children: string
  active?: boolean
}) {
  return (
    <button
      type="button"
      className={[
        'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors',
        active
          ? 'bg-primary text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
