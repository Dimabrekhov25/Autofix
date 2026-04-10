import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { getPartsRequest, type CatalogPartDto } from '../../apis/catalogApi'
import {
  createInventoryItemRequest,
  getInventoryErrorMessage,
} from '../../apis/inventoryApi'
import { useAuth } from '../../features/auth/useAuth'
import { APP_ROUTES } from '../../shared/config/routes'
import { Button } from '../../shared/ui/Button'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

interface InventoryCreateFormState {
  partId: string
  quantityOnHand: string
  reservedQuantity: string
  minLevel: string
}

function createInitialFormState(): InventoryCreateFormState {
  return {
    partId: '',
    quantityOnHand: '0',
    reservedQuantity: '0',
    minLevel: '0',
  }
}

export function InventoryAddPartPage() {
  const navigate = useNavigate()
  const { tokens } = useAuth()
  const accessToken = tokens?.accessToken

  const [parts, setParts] = useState<CatalogPartDto[]>([])
  const [form, setForm] = useState<InventoryCreateFormState>(() => createInitialFormState())
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadParts() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const nextParts = await getPartsRequest(accessToken)

        if (isMounted) {
          setParts(nextParts)
          setForm((current) => ({
            ...current,
            partId: current.partId || nextParts[0]?.id || '',
          }))
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            getInventoryErrorMessage(error, 'Unable to load parts for inventory creation.'),
          )
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

  function handleBack() {
    if (window.history.state?.idx > 0) {
      navigate(-1)
      return
    }

    navigate(APP_ROUTES.inventory)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const quantityOnHand = Number.parseInt(form.quantityOnHand, 10)
    const reservedQuantity = Number.parseInt(form.reservedQuantity, 10)
    const minLevel = Number.parseInt(form.minLevel, 10)

    if (!form.partId) {
      setErrorMessage('Select a part before creating an inventory item.')
      return
    }

    if ([quantityOnHand, reservedQuantity, minLevel].some((value) => !Number.isInteger(value) || value < 0)) {
      setErrorMessage('All inventory quantities must be whole numbers greater than or equal to 0.')
      return
    }

    if (reservedQuantity > quantityOnHand) {
      setErrorMessage('Reserved quantity cannot be greater than quantity on hand.')
      return
    }

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await createInventoryItemRequest(
        {
          partId: form.partId,
          quantityOnHand,
          reservedQuantity,
          minLevel,
        },
        accessToken,
      )

      navigate(APP_ROUTES.inventory)
    } catch (error) {
      setErrorMessage(
        getInventoryErrorMessage(error, 'Unable to create the inventory item right now.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell searchPlaceholder="Search inventory items...">
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
              <span className="font-medium text-slate-500">Add Inventory Item</span>
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
              Workshop Inventory
            </span>
            <div>
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Add Inventory Item
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-on-surface-variant sm:text-base">
                Add a part from the catalog and set current stock values for the workshop.
              </p>
            </div>
          </div>

          {errorMessage ? (
            <div className="mb-6 rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
              {errorMessage}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-surface-container-lowest shadow-panel">
            <form className="space-y-8 p-6 sm:p-8 lg:p-10" onSubmit={handleSubmit}>
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 md:col-span-4">
                  <h2 className="mb-1 font-headline text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
                    Select Part
                  </h2>
                  <p className="text-xs leading-6 text-on-surface-variant">
                    Choose the part you are adding to inventory.
                  </p>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <label className="space-y-2">
                    <span className="block pl-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                      Part
                    </span>
                    <div className="relative">
                      <select
                        value={form.partId}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, partId: event.target.value }))
                        }
                        disabled={isLoading || isSubmitting || parts.length === 0}
                        className="w-full appearance-none rounded-xl border-none bg-surface-container-low px-4 py-3 pr-12 text-sm text-slate-900 focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                      >
                        {parts.length === 0 ? (
                          <option value="">
                            {isLoading ? 'Loading parts...' : 'No parts available'}
                          </option>
                        ) : null}
                        {parts.map((part) => (
                          <option key={part.id} value={part.id}>
                            {part.name}
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
                    Stock Levels
                  </h2>
                  <p className="text-xs leading-6 text-on-surface-variant">
                    Enter current stock numbers for this part.
                  </p>
                </div>
                <div className="col-span-12 grid gap-6 md:col-span-8 md:grid-cols-3">
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
              </div>

              <div className="flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-400">
                  <MaterialIcon name="lock" className="text-sm" />
                  <span>Inventory Team</span>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <Button to={APP_ROUTES.inventory} tone="secondary" className="px-6 py-3 text-sm">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || isSubmitting || parts.length === 0}
                    className="px-7 py-3 text-sm shadow-lg shadow-primary/20"
                  >
                    {isSubmitting ? 'Creating...' : 'Add to Inventory'}
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
    <label className="space-y-2">
      <span className="block pl-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
        {label}
      </span>
      <input
        type="number"
        min="0"
        step="1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-primary/30"
      />
    </label>
  )
}
