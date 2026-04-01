import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'

import {
  createPartRequest,
  deletePartRequest,
  getCatalogErrorMessage,
  getPartsRequest,
  type CatalogPartDto,
  updatePartRequest,
} from '../../apis/catalogApi'
import { useAuth } from '../../features/auth/useAuth'
import { Button } from '../../shared/ui/Button'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

type PartStatusFilter = 'all' | 'active' | 'inactive'

const priceRangeOptions = [
  { value: 'all', label: 'Any Price' },
  { value: '0-2500', label: '$0 - $2,500' },
  { value: '2500-5000', label: '$2,500 - $5,000' },
  { value: '5000-10000', label: '$5,000 - $10,000' },
  { value: '10000+', label: '$10,000+' },
] as const

const statusBadgeClassNames: Record<Exclude<PartStatusFilter, 'all'>, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-slate-200 text-slate-600',
}

interface PartFormState {
  name: string
  unitPrice: string
  isActive: boolean
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

function createInitialPartForm(): PartFormState {
  return {
    name: '',
    unitPrice: '',
    isActive: true,
  }
}

function createFormState(part: CatalogPartDto | null): PartFormState {
  if (!part) {
    return createInitialPartForm()
  }

  return {
    name: part.name,
    unitPrice: part.unitPrice.toString(),
    isActive: part.isActive,
  }
}

export function PartsCatalogPage() {
  const { tokens } = useAuth()
  const accessToken = tokens?.accessToken

  const [parts, setParts] = useState<CatalogPartDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingPartId, setDeletingPartId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [dialogErrorMessage, setDialogErrorMessage] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [statusValue, setStatusValue] = useState<PartStatusFilter>('all')
  const [priceRangeValue, setPriceRangeValue] =
    useState<(typeof priceRangeOptions)[number]['value']>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPart, setEditingPart] = useState<CatalogPartDto | null>(null)
  const [partPendingDelete, setPartPendingDelete] = useState<CatalogPartDto | null>(null)
  const [form, setForm] = useState<PartFormState>(() => createInitialPartForm())

  useEffect(() => {
    let isMounted = true

    async function loadParts() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const nextParts = await getPartsRequest(accessToken)

        if (isMounted) {
          setParts(nextParts)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getCatalogErrorMessage(error, 'Unable to load parts catalog right now.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadParts()

    return () => {
      isMounted = false
    }
  }, [accessToken])

  const normalizedSearch = searchValue.trim().toLowerCase()

  const filteredParts = parts.filter((part) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      part.name.toLowerCase().includes(normalizedSearch)

    const matchesStatus =
      statusValue === 'all' ||
      (statusValue === 'active' ? part.isActive : !part.isActive)
    const matchesPrice = matchesPriceRange(part.unitPrice, priceRangeValue)

    return matchesSearch && matchesStatus && matchesPrice
  })

  const totalValue = parts.reduce((sum, part) => sum + part.unitPrice, 0)
  const activePartsCount = parts.filter((part) => part.isActive).length
  const inactivePartsCount = parts.length - activePartsCount

  function openCreateDialog() {
    setEditingPart(null)
    setForm(createInitialPartForm())
    setDialogErrorMessage(null)
    setIsDialogOpen(true)
  }

  function openEditDialog(part: CatalogPartDto) {
    setEditingPart(part)
    setForm(createFormState(part))
    setDialogErrorMessage(null)
    setIsDialogOpen(true)
  }

  function closeDialog() {
    setIsDialogOpen(false)
    setEditingPart(null)
    setForm(createInitialPartForm())
    setDialogErrorMessage(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedName = form.name.trim()
    const parsedPrice = Number.parseFloat(form.unitPrice)

    if (!normalizedName) {
      setDialogErrorMessage('Part name is required.')
      return
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setDialogErrorMessage('Unit price must be a valid non-negative number.')
      return
    }

    setDialogErrorMessage(null)
    setIsSubmitting(true)

    try {
      if (editingPart) {
        const updatedPart = await updatePartRequest(
          {
            id: editingPart.id,
            name: normalizedName,
            unitPrice: parsedPrice,
            isActive: form.isActive,
          },
          accessToken,
        )

        setParts((current) =>
          current.map((part) => (part.id === updatedPart.id ? updatedPart : part)),
        )
      } else {
        const createdPart = await createPartRequest(
          {
            name: normalizedName,
            unitPrice: parsedPrice,
            isActive: form.isActive,
          },
          accessToken,
        )

        setParts((current) => [createdPart, ...current])
      }

      closeDialog()
    } catch (error) {
      setDialogErrorMessage(
        getCatalogErrorMessage(error, 'Unable to save this part right now.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function openDeleteDialog(part: CatalogPartDto) {
    setPartPendingDelete(part)
  }

  function closeDeleteDialog() {
    if (deletingPartId) {
      return
    }

    setPartPendingDelete(null)
  }

  async function handleDelete() {
    if (!partPendingDelete) {
      return
    }

    setErrorMessage(null)
    setDeletingPartId(partPendingDelete.id)

    try {
      await deletePartRequest(partPendingDelete.id, accessToken)
      setParts((current) => current.filter((item) => item.id !== partPendingDelete.id))
      setPartPendingDelete(null)
    } catch (error) {
      setErrorMessage(
        getCatalogErrorMessage(error, 'Unable to delete this part right now.'),
      )
    } finally {
      setDeletingPartId(null)
    }
  }

  return (
    <DashboardShell searchPlaceholder="Search parts by name...">
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
                  Live CRUD workspace for the backend `Parts` entity.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={openCreateDialog}
              className="px-6 py-3 text-sm shadow-lg shadow-primary/20"
            >
              <MaterialIcon name="add_circle" className="text-lg" />
              <span>Add New Part</span>
            </Button>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total Parts"
              value={parts.length.toLocaleString('en-US')}
              accent="border-primary"
            />
            <MetricCard
              label="Active Parts"
              value={activePartsCount.toLocaleString('en-US')}
              accent="border-emerald-400"
            />
            <MetricCard
              label="Inactive Parts"
              value={inactivePartsCount.toLocaleString('en-US')}
              accent="border-slate-300"
            />
            <MetricCard
              label="Catalog Value"
              value={formatCurrency(totalValue)}
              accent="border-slate-300"
            />
          </div>

          {errorMessage ? (
            <div className="mb-6 rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
              {errorMessage}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-surface-container-lowest shadow-panel">
            <div className="border-b border-slate-100 bg-slate-50/70 p-6">
              <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr_1fr_auto]">
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
                    Status
                  </span>
                  <div className="relative">
                    <select
                      value={statusValue}
                      onChange={(event) => setStatusValue(event.target.value as PartStatusFilter)}
                      className="w-full appearance-none rounded-xl border-none bg-white px-4 py-3 pr-11 text-sm font-medium text-slate-900 shadow-sm focus:ring-2 focus:ring-primary/20"
                    >
                      {(['all', 'active', 'inactive'] as const).map((option) => (
                        <option key={option} value={option}>
                          {option === 'all'
                            ? 'All Statuses'
                            : option.charAt(0).toUpperCase() + option.slice(1)}
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

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchValue('')
                      setStatusValue('all')
                      setPriceRangeValue('all')
                    }}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-surface-container px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-surface-container-high xl:w-auto"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Part Name and ID
                    </th>
                    <th className="px-6 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Status
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-16 text-center text-sm font-medium text-slate-500">
                        Loading parts catalog...
                      </td>
                    </tr>
                  ) : filteredParts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-16 text-center">
                        <div className="mx-auto max-w-md space-y-2">
                          <p className="font-headline text-xl font-bold text-slate-900">
                            No parts found
                          </p>
                          <p className="text-sm font-medium text-slate-500">
                            Adjust the filters or create a new part to populate this catalog.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredParts.map((part) => (
                      <tr key={part.id} className="group transition-colors hover:bg-slate-50/80">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                              <MaterialIcon name="precision_manufacturing" className="text-xl" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{part.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={[
                              'inline-flex rounded-full px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.16em]',
                              statusBadgeClassNames[part.isActive ? 'active' : 'inactive'],
                            ].join(' ')}
                          >
                            {part.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-900">{formatCurrency(part.unitPrice)}</p>
                          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-slate-400">
                            Live backend value
                          </p>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => openEditDialog(part)}
                              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary/5 hover:text-primary"
                              aria-label={`Edit ${part.name}`}
                            >
                              <MaterialIcon name="edit" className="text-lg" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openDeleteDialog(part)}
                              disabled={deletingPartId === part.id}
                              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-error/5 hover:text-error disabled:opacity-50"
                              aria-label={`Delete ${part.name}`}
                            >
                              <MaterialIcon
                                name={deletingPartId === part.id ? 'hourglass_top' : 'delete'}
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
                Showing {filteredParts.length} of {parts.length} backend parts
              </p>
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-slate-400">
                CRUD synced with `/api/v1/Parts`
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 opacity-60">
            <div className="flex flex-wrap gap-4">
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-slate-500">
                Parts Endpoint Live
              </span>
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-slate-500">
                Base URL: /api/v1/Parts
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

        {isDialogOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-surface-container-lowest shadow-2xl">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-primary">
                      {editingPart ? 'Update Part' : 'Create Part'}
                    </p>
                    <h2 className="mt-2 font-headline text-3xl font-black tracking-tight text-slate-900">
                      {editingPart ? 'Edit catalog entry' : 'Add a new catalog entry'}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      This form maps directly to your backend DTO: `name`, `unitPrice`, `isActive`.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Close part dialog"
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
                    Part Name
                  </span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="e.g. Ceramic Brake Pad Kit"
                    className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="block pl-1 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                      Unit Price
                    </span>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.unitPrice}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            unitPrice: event.target.value,
                          }))
                        }
                        placeholder="0.00"
                        className="w-full rounded-xl border-none bg-surface-container-low py-3 pl-8 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          isActive: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Active part</p>
                      <p className="text-xs font-medium text-slate-500">
                        Inactive parts stay visible in the catalog but are marked as disabled.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                  <Button type="button" tone="secondary" onClick={closeDialog} className="px-6 py-3">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="px-6 py-3">
                    {isSubmitting
                      ? 'Saving...'
                      : editingPart
                        ? 'Save Changes'
                        : 'Create Part'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {partPendingDelete ? (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 py-8 backdrop-blur-sm">
            <div className="w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-surface-container-lowest shadow-2xl">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-error">
                      Confirm Delete
                    </p>
                    <h2 className="mt-2 font-headline text-3xl font-black tracking-tight text-slate-900">
                      Remove this part?
                    </h2>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                      The part <span className="font-bold text-slate-900">{partPendingDelete.name}</span> will be removed from the catalog.
                      This action cannot be undone from the UI.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeDeleteDialog}
                    className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Close delete dialog"
                  >
                    <MaterialIcon name="close" className="text-lg" />
                  </button>
                </div>
              </div>

              <div className="space-y-5 px-6 py-6 sm:px-8">
                <div className="rounded-[1.4rem] border border-error/10 bg-error/5 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-error/10 text-error">
                      <MaterialIcon name="delete_forever" className="text-xl" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Catalog deletion</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        If this part is used elsewhere in the system, the backend may reject the deletion request.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button type="button" tone="secondary" onClick={closeDeleteDialog} className="px-6 py-3">
                    Cancel
                  </Button>
                  <button
                    type="button"
                    onClick={() => void handleDelete()}
                    disabled={Boolean(deletingPartId)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-error px-6 py-3 font-headline text-sm font-bold tracking-wide text-white transition duration-200 hover:-translate-y-0.5 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/25 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-60"
                  >
                    <MaterialIcon
                      name={deletingPartId ? 'hourglass_top' : 'delete'}
                      className="text-base"
                    />
                    <span>{deletingPartId ? 'Deleting...' : 'Delete Part'}</span>
                  </button>
                </div>
              </div>
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
