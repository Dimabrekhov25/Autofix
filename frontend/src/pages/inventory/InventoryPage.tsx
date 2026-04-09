import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'

import { getPartsRequest, type CatalogPartDto } from '../../apis/catalogApi'
import {
  deleteInventoryItemRequest,
  getInventoryErrorMessage,
  getInventoryItemsRequest,
  type InventoryItemDto,
  updateInventoryItemRequest,
} from '../../apis/inventoryApi'
import { useAuth } from '../../features/auth/useAuth'
import { APP_ROUTES } from '../../shared/config/routes'
import { Button } from '../../shared/ui/Button'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { SelectField } from '../../shared/ui/SelectField'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

type InventoryStatusFilter = 'all' | 'healthy' | 'low' | 'out'

interface InventoryFormState {
  partId: string
  quantityOnHand: string
  reservedQuantity: string
  minLevel: string
}

interface InventoryRow extends InventoryItemDto {
  partName: string
  partUnitPrice: number | null
  availableQuantity: number
  status: Exclude<InventoryStatusFilter, 'all'>
}

const statusBadgeClassNames: Record<Exclude<InventoryStatusFilter, 'all'>, string> = {
  healthy: 'bg-emerald-100 text-emerald-700',
  low: 'bg-amber-100 text-amber-700',
  out: 'bg-rose-100 text-rose-700',
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

function createInitialFormState(): InventoryFormState {
  return {
    partId: '',
    quantityOnHand: '0',
    reservedQuantity: '0',
    minLevel: '0',
  }
}

function createFormState(item: InventoryItemDto): InventoryFormState {
  return {
    partId: item.partId,
    quantityOnHand: item.quantityOnHand.toString(),
    reservedQuantity: item.reservedQuantity.toString(),
    minLevel: item.minLevel.toString(),
  }
}

function getInventoryStatus(item: InventoryItemDto): Exclude<InventoryStatusFilter, 'all'> {
  const availableQuantity = item.quantityOnHand - item.reservedQuantity

  if (item.quantityOnHand <= 0 || availableQuantity <= 0) {
    return 'out'
  }

  if (availableQuantity <= item.minLevel) {
    return 'low'
  }

  return 'healthy'
}

function toInventoryRow(
  item: InventoryItemDto,
  partsMap: Map<string, CatalogPartDto>,
): InventoryRow {
  const part = partsMap.get(item.partId)
  const availableQuantity = item.quantityOnHand - item.reservedQuantity

  return {
    ...item,
    partName: part?.name ?? `Unknown part (${item.partId})`,
    partUnitPrice: part?.unitPrice ?? null,
    availableQuantity,
    status: getInventoryStatus(item),
  }
}

export function InventoryPage() {
  const { tokens } = useAuth()
  const accessToken = tokens?.accessToken

  const [inventoryItems, setInventoryItems] = useState<InventoryItemDto[]>([])
  const [parts, setParts] = useState<CatalogPartDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [dialogErrorMessage, setDialogErrorMessage] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [statusValue, setStatusValue] = useState<InventoryStatusFilter>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItemDto | null>(null)
  const [form, setForm] = useState<InventoryFormState>(() => createInitialFormState())

  useEffect(() => {
    let isMounted = true

    async function loadInventoryContext() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const [nextInventoryItems, nextParts] = await Promise.all([
          getInventoryItemsRequest(accessToken),
          getPartsRequest(accessToken),
        ])

        if (isMounted) {
          setInventoryItems(nextInventoryItems)
          setParts(nextParts)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            getInventoryErrorMessage(error, 'Unable to load inventory right now.'),
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadInventoryContext()

    return () => {
      isMounted = false
    }
  }, [accessToken])

  const partsMap = new Map(parts.map((part) => [part.id, part]))
  const rows = inventoryItems.map((item) => toInventoryRow(item, partsMap))

  const normalizedSearch = searchValue.trim().toLowerCase()
  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      row.partName.toLowerCase().includes(normalizedSearch)

    const matchesStatus = statusValue === 'all' || row.status === statusValue

    return matchesSearch && matchesStatus
  })

  const totalOnHand = rows.reduce((sum, row) => sum + row.quantityOnHand, 0)
  const totalReserved = rows.reduce((sum, row) => sum + row.reservedQuantity, 0)
  const lowStockCount = rows.filter((row) => row.status === 'low' || row.status === 'out').length
  const inventoryValue = rows.reduce((sum, row) => {
    if (row.partUnitPrice === null) {
      return sum
    }

    return sum + row.quantityOnHand * row.partUnitPrice
  }, 0)

  function openEditDialog(item: InventoryItemDto) {
    setEditingItem(item)
    setForm(createFormState(item))
    setDialogErrorMessage(null)
    setIsDialogOpen(true)
  }

  function closeDialog() {
    setEditingItem(null)
    setForm(createInitialFormState())
    setDialogErrorMessage(null)
    setIsDialogOpen(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const quantityOnHand = Number.parseInt(form.quantityOnHand, 10)
    const reservedQuantity = Number.parseInt(form.reservedQuantity, 10)
    const minLevel = Number.parseInt(form.minLevel, 10)

    if (!editingItem) {
      setDialogErrorMessage('No inventory item selected for editing.')
      return
    }

    if (!form.partId) {
      setDialogErrorMessage('Part is required.')
      return
    }

    if ([quantityOnHand, reservedQuantity, minLevel].some((value) => !Number.isInteger(value) || value < 0)) {
      setDialogErrorMessage('All inventory quantities must be whole numbers greater than or equal to 0.')
      return
    }

    if (reservedQuantity > quantityOnHand) {
      setDialogErrorMessage('Reserved quantity cannot be greater than quantity on hand.')
      return
    }

    setDialogErrorMessage(null)
    setIsSubmitting(true)

    try {
      const updatedItem = await updateInventoryItemRequest(
        {
          id: editingItem.id,
          partId: form.partId,
          quantityOnHand,
          reservedQuantity,
          minLevel,
        },
        accessToken,
      )

      setInventoryItems((current) =>
        current.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      )
      closeDialog()
    } catch (error) {
      setDialogErrorMessage(
        getInventoryErrorMessage(error, 'Unable to update this inventory item right now.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(item: InventoryItemDto) {
    const shouldDelete = window.confirm(`Delete inventory entry ${item.id}?`)

    if (!shouldDelete) {
      return
    }

    setErrorMessage(null)
    setDeletingItemId(item.id)

    try {
      await deleteInventoryItemRequest(item.id, accessToken)
      setInventoryItems((current) => current.filter((entry) => entry.id !== item.id))
    } catch (error) {
      setErrorMessage(
        getInventoryErrorMessage(error, 'Unable to delete this inventory item right now.'),
      )
    } finally {
      setDeletingItemId(null)
    }
  }

  return (
    <DashboardShell searchPlaceholder="Search inventory by part name...">
      <section className="relative overflow-hidden pb-8 pt-2">
        <div className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-secondary/10 blur-[100px]" />

        <div className="relative">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[0.6875rem] font-black uppercase tracking-[0.24em] text-primary">
                Internal Ops
              </span>
              <div>
                <h1 className="font-headline text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                  Inventory
                </h1>
                <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-on-surface-variant sm:text-base">
                  Live inventory workspace connected to the backend `Inventory` and `Parts` endpoints.
                </p>
              </div>
            </div>

            <Button to={APP_ROUTES.inventoryAddPart} className="px-6 py-3 text-sm shadow-lg shadow-primary/20">
              <MaterialIcon name="add_circle" className="text-lg" />
              <span>Add Inventory Item</span>
            </Button>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Tracked Items" value={rows.length.toLocaleString('en-US')} accent="border-primary" />
            <MetricCard label="Units On Hand" value={totalOnHand.toLocaleString('en-US')} accent="border-emerald-400" />
            <MetricCard label="Reserved Units" value={totalReserved.toLocaleString('en-US')} accent="border-amber-400" />
            <MetricCard label="Inventory Value" value={formatCurrency(inventoryValue)} accent="border-slate-300" />
          </div>

          {lowStockCount > 0 ? (
            <div className="mb-6 rounded-[1.5rem] border border-amber-200 bg-amber-50/80 px-5 py-4 text-sm text-amber-900">
              {lowStockCount} inventory item{lowStockCount === 1 ? '' : 's'} are at or below the minimum level.
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mb-6 rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
              {errorMessage}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-surface-container-lowest shadow-panel">
            <div className="border-b border-slate-100 bg-slate-50/70 p-6">
              <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr_auto]">
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
                      placeholder="Part name"
                      className="w-full rounded-xl border-none bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="block pl-1 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                    Stock Status
                  </span>
                  <SelectField
                    value={statusValue}
                    onChange={(event) => setStatusValue(event.target.value as InventoryStatusFilter)}
                    className="border-none bg-white py-3 text-sm font-medium text-slate-900 shadow-sm focus:ring-2 focus:ring-primary/20"
                    iconClassName="text-slate-400"
                  >
                    {(['all', 'healthy', 'low', 'out'] as const).map((option) => (
                      <option key={option} value={option}>
                        {option === 'all' ? 'All Statuses' : option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </SelectField>
                </label>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchValue('')
                      setStatusValue('all')
                    }}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-surface-container px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-surface-container-high xl:w-auto"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Part
                    </th>
                    <th className="px-6 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Stock Status
                    </th>
                    <th className="px-6 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      On Hand
                    </th>
                    <th className="px-6 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Reserved
                    </th>
                    <th className="px-6 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Available
                    </th>
                    <th className="px-6 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Min Level
                    </th>
                    <th className="px-8 py-4 text-right text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-8 py-16 text-center text-sm font-medium text-slate-500">
                        Loading inventory...
                      </td>
                    </tr>
                  ) : filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-8 py-16 text-center">
                        <div className="mx-auto max-w-md space-y-2">
                          <p className="font-headline text-xl font-bold text-slate-900">
                            No inventory items found
                          </p>
                          <p className="text-sm font-medium text-slate-500">
                            Adjust the filters or create a new inventory item.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="group transition-colors hover:bg-slate-50/80">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                              <MaterialIcon name="inventory_2" className="text-xl" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{row.partName}</p>
                              {row.partUnitPrice !== null ? (
                                <p className="text-xs font-semibold text-slate-500">
                                  Unit price: {formatCurrency(row.partUnitPrice)}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={[
                              'inline-flex rounded-full px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.16em]',
                              statusBadgeClassNames[row.status],
                            ].join(' ')}
                          >
                            {row.status === 'healthy'
                              ? 'Healthy'
                              : row.status === 'low'
                                ? 'Low'
                                : 'Out'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-900">{row.quantityOnHand}</td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-600">{row.reservedQuantity}</td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-600">{row.availableQuantity}</td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-600">{row.minLevel}</td>
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => openEditDialog(row)}
                              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary/5 hover:text-primary"
                              aria-label={`Edit inventory item ${row.id}`}
                            >
                              <MaterialIcon name="edit" className="text-lg" />
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDelete(row)}
                              disabled={deletingItemId === row.id}
                              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-error/5 hover:text-error disabled:opacity-50"
                              aria-label={`Delete inventory item ${row.id}`}
                            >
                              <MaterialIcon
                                name={deletingItemId === row.id ? 'hourglass_top' : 'delete'}
                                className="text-lg"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-8 py-4">
              <p className="text-xs font-medium text-slate-500">
                Showing {filteredRows.length} of {rows.length} backend inventory items
              </p>
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-slate-400">
                CRUD synced with `/api/v1/Inventory`
              </span>
            </div>
          </div>
        </div>

        {isDialogOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-surface-container-lowest shadow-2xl">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-primary">
                      Update Inventory
                    </p>
                    <h2 className="mt-2 font-headline text-3xl font-black tracking-tight text-slate-900">
                      Edit inventory item
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      This form maps directly to your backend DTO: `partId`, `quantityOnHand`, `reservedQuantity`, `minLevel`.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Close inventory dialog"
                  >
                    <MaterialIcon name="close" className="text-lg" />
                  </button>
                </div>
              </div>

              <form className="space-y-6 px-6 py-6 sm:px-8" onSubmit={handleSubmit}>
                {dialogErrorMessage ? (
                  <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 text-sm text-error">
                    {dialogErrorMessage}
                  </div>
                ) : null}

                <label className="block space-y-2">
                  <span className="block pl-1 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                    Part
                  </span>
                  <SelectField
                    value={form.partId}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, partId: event.target.value }))
                    }
                    className="border-none bg-surface-container-low py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-primary/20"
                    iconClassName="text-slate-400"
                  >
                    <option value="">Select a part</option>
                    {parts.map((part) => (
                      <option key={part.id} value={part.id}>
                        {part.name}
                      </option>
                    ))}
                  </SelectField>
                </label>

                <div className="grid gap-6 md:grid-cols-3">
                  <NumberField
                    label="Quantity On Hand"
                    value={form.quantityOnHand}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, quantityOnHand: value }))
                    }
                  />
                  <NumberField
                    label="Reserved Quantity"
                    value={form.reservedQuantity}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, reservedQuantity: value }))
                    }
                  />
                  <NumberField
                    label="Min Level"
                    value={form.minLevel}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, minLevel: value }))
                    }
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                  <Button type="button" tone="secondary" onClick={closeDialog} className="px-6 py-3">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="px-6 py-3">
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
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

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block space-y-2">
      <span className="block pl-1 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
        {label}
      </span>
      <input
        type="number"
        min="0"
        step="1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-primary/20"
      />
    </label>
  )
}
