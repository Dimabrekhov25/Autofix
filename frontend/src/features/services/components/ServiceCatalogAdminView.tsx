import type { FormEvent } from 'react'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'

import {
  createServiceCatalogItemRequest,
  deleteServiceCatalogItemRequest,
  getCatalogErrorMessage,
  getServiceCatalogItemsRequest,
  type ServiceCatalogItemDto,
  updateServiceCatalogItemRequest,
} from '../../../apis/catalogApi'
import { Button } from '../../../shared/ui/Button'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import { ServiceCatalogDeleteDialog } from './ServiceCatalogDeleteDialog'
import { ServiceCatalogEditorDialog } from './ServiceCatalogEditorDialog'
import {
  createFormState,
  createInitialFormState,
  getCategoryChipClassName,
  getCategoryLabel,
  formatCurrency,
  formatDurationLabel,
  isValidDuration,
  type ServiceCatalogFormState,
} from '../lib/serviceCatalog'

type ServiceStatusFilter = 'all' | 'active' | 'inactive'
type ServiceCategoryFilter = 'all' | 'service' | 'diagnostic'

interface ServiceCatalogAdminViewProps {
  accessToken?: string
}

function ServiceMetricCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: string
}) {
  return (
    <article className={`rounded-[1.5rem] border-l-4 bg-white/90 p-5 shadow-panel ${accent}`}>
      <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-headline font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
    </article>
  )
}

export function ServiceCatalogAdminView({
  accessToken,
}: ServiceCatalogAdminViewProps) {
  const [items, setItems] = useState<ServiceCatalogItemDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [dialogErrorMessage, setDialogErrorMessage] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState<ServiceStatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategoryFilter>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ServiceCatalogItemDto | null>(null)
  const [itemPendingDelete, setItemPendingDelete] = useState<ServiceCatalogItemDto | null>(null)
  const [form, setForm] = useState<ServiceCatalogFormState>(() => createInitialFormState())
  const deferredSearchValue = useDeferredValue(searchValue)

  useEffect(() => {
    let isMounted = true

    async function loadCatalog() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const nextItems = await getServiceCatalogItemsRequest({}, accessToken)

        if (!isMounted) {
          return
        }

        setItems(nextItems)
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getCatalogErrorMessage(error, 'Unable to load services right now.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadCatalog()

    return () => {
      isMounted = false
    }
  }, [accessToken])

  const normalizedSearch = deferredSearchValue.trim().toLowerCase()

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesSearch =
          normalizedSearch.length === 0
          || item.name.toLowerCase().includes(normalizedSearch)
          || item.description.toLowerCase().includes(normalizedSearch)

        const matchesStatus =
          statusFilter === 'all'
          || (statusFilter === 'active' ? item.isActive : !item.isActive)

        const matchesCategory =
          categoryFilter === 'all'
          || (categoryFilter === 'service' ? item.category === 0 : item.category === 1)

        return matchesSearch && matchesStatus && matchesCategory
      }),
    [categoryFilter, items, normalizedSearch, statusFilter],
  )

  const activeItemsCount = items.filter((item) => item.isActive).length
  const diagnosticsCount = items.filter((item) => item.category === 1).length

  function openCreateDialog() {
    setEditingItem(null)
    setForm(createInitialFormState())
    setDialogErrorMessage(null)
    setIsDialogOpen(true)
  }

  function openEditDialog(item: ServiceCatalogItemDto) {
    setEditingItem(item)
    setForm(createFormState(item))
    setDialogErrorMessage(null)
    setIsDialogOpen(true)
  }

  function closeDialog() {
    if (isSubmitting) {
      return
    }

    setIsDialogOpen(false)
    setEditingItem(null)
    setForm(createInitialFormState())
    setDialogErrorMessage(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedName = form.name.trim()
    const normalizedDescription = form.description.trim()
    const basePrice = Number.parseFloat(form.basePrice)

    if (!normalizedName) {
      setDialogErrorMessage('Service name is required.')
      return
    }

    if (!normalizedDescription) {
      setDialogErrorMessage('Description is required.')
      return
    }

    if (!Number.isFinite(basePrice) || basePrice < 0) {
      setDialogErrorMessage('Base price must be a valid non-negative number.')
      return
    }

    if (!isValidDuration(form.estimatedDuration)) {
      setDialogErrorMessage('Estimated duration must use the format HH:MM:SS.')
      return
    }

    setDialogErrorMessage(null)
    setIsSubmitting(true)

    try {
      const category: 0 | 1 = form.category === 'service' ? 0 : 1
      const payload = {
        name: normalizedName,
        description: normalizedDescription,
        category,
        basePrice,
        estimatedLaborCost: 0,
        estimatedDuration: form.estimatedDuration.trim(),
        isActive: form.isActive,
        requiredParts: [],
      }

      if (editingItem) {
        const updatedItem = await updateServiceCatalogItemRequest(
          {
            id: editingItem.id,
            ...payload,
          },
          accessToken,
        )

        setItems((current) => current.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
      } else {
        const createdItem = await createServiceCatalogItemRequest(payload, accessToken)
        setItems((current) => [createdItem, ...current])
      }

      closeDialog()
    } catch (error) {
      setDialogErrorMessage(getCatalogErrorMessage(error, 'Unable to save this catalog item right now.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!itemPendingDelete) {
      return
    }

    setDeletingItemId(itemPendingDelete.id)
    setErrorMessage(null)

    try {
      await deleteServiceCatalogItemRequest(itemPendingDelete.id, accessToken)
      setItems((current) => current.filter((item) => item.id !== itemPendingDelete.id))
      setItemPendingDelete(null)
    } catch (error) {
      setErrorMessage(getCatalogErrorMessage(error, 'Unable to delete this catalog item right now.'))
    } finally {
      setDeletingItemId(null)
    }
  }

  return (
    <>
      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ServiceMetricCard
          label="Services and Diagnostics"
          value={items.length.toLocaleString('en-US')}
          accent="border-primary"
        />
        <ServiceMetricCard
          label="Active Items"
          value={activeItemsCount.toLocaleString('en-US')}
          accent="border-emerald-400"
        />
        <ServiceMetricCard
          label="Diagnostics"
          value={diagnosticsCount.toLocaleString('en-US')}
          accent="border-amber-400"
        />
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
            Service Management
          </p>
          <h2 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-slate-900">
            Services and diagnostics
          </h2>
        </div>

        <Button type="button" onClick={openCreateDialog} className="px-6 py-3 text-sm">
          <MaterialIcon name="add_circle" className="text-lg" />
          <span>Add Item</span>
        </Button>
      </div>

      {errorMessage ? (
        <div className="mb-6 rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
          {errorMessage}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/85 shadow-panel">
        <div className="border-b border-slate-100 bg-slate-50/70 p-6">
          <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr_1fr_auto]">
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
                  placeholder="Service name or description"
                  className="w-full rounded-xl border-none bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="block pl-1 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                Category
              </span>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value as ServiceCategoryFilter)}
                  className="w-full appearance-none rounded-xl border-none bg-white px-4 py-3 pr-11 text-sm font-medium text-slate-900 shadow-sm focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Categories</option>
                  <option value="service">Services</option>
                  <option value="diagnostic">Diagnostics</option>
                </select>
                <MaterialIcon
                  name="expand_more"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="block pl-1 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                Status
              </span>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as ServiceStatusFilter)}
                  className="w-full appearance-none rounded-xl border-none bg-white px-4 py-3 pr-11 text-sm font-medium text-slate-900 shadow-sm focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
                  setCategoryFilter('all')
                  setStatusFilter('all')
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
                  Service
                </th>
                <th className="px-6 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                  Category
                </th>
                <th className="px-6 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                  Pricing
                </th>
                <th className="px-6 py-4 text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                  Duration
                </th>
                <th className="px-8 py-4 text-right text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-sm text-slate-500">
                    Loading services and diagnostics...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-sm text-slate-500">
                    No items match the current filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 align-top">
                    <td className="px-8 py-5">
                      <div className="max-w-xl">
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-bold text-slate-900">{item.name}</p>
                          <span
                            className={[
                              'inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em]',
                              item.isActive
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-200 text-slate-600',
                            ].join(' ')}
                          >
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                        <p className="mt-3 text-xs text-slate-400">ID: {item.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={[
                          'inline-flex rounded-full px-3 py-1 text-[0.6875rem] font-black uppercase tracking-[0.18em]',
                          getCategoryChipClassName(item.category),
                        ].join(' ')}
                      >
                        {getCategoryLabel(item.category)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">
                      <p className="font-bold text-slate-900">From {formatCurrency(item.basePrice)}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Service-only starting price
                      </p>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                      {formatDurationLabel(item.estimatedDuration)}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => openEditDialog(item)}
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200"
                        >
                          <MaterialIcon name="edit" className="text-base" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemPendingDelete(item)}
                          className="inline-flex items-center gap-2 rounded-xl bg-error/10 px-4 py-2 text-sm font-bold text-error transition-colors hover:bg-error/15"
                        >
                          <MaterialIcon name="delete" className="text-base" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDialogOpen ? (
        <ServiceCatalogEditorDialog
          editingItem={editingItem}
          form={form}
          isSubmitting={isSubmitting}
          errorMessage={dialogErrorMessage}
          onClose={closeDialog}
          onSubmit={handleSubmit}
          onChange={(updater) => setForm((current) => updater(current))}
        />
      ) : null}

      {itemPendingDelete ? (
        <ServiceCatalogDeleteDialog
          itemName={itemPendingDelete.name}
          isDeleting={deletingItemId === itemPendingDelete.id}
          onCancel={() => {
            if (!deletingItemId) {
              setItemPendingDelete(null)
            }
          }}
          onConfirm={() => {
            void handleDelete()
          }}
        />
      ) : null}
    </>
  )
}
