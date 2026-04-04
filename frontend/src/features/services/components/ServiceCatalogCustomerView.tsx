import { useEffect, useMemo, useState } from 'react'

import {
  getCatalogErrorMessage,
  getServiceCatalogItemsRequest,
  type ServiceCatalogItemDto,
} from '../../../apis/catalogApi'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import {
  formatCurrency,
  formatDurationLabel,
} from '../lib/serviceCatalog'

interface ServiceCatalogCustomerViewProps {
  accessToken?: string
}

export function ServiceCatalogCustomerView({
  accessToken,
}: ServiceCatalogCustomerViewProps) {
  const [items, setItems] = useState<ServiceCatalogItemDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadCatalog() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const nextItems = await getServiceCatalogItemsRequest(
          { isActive: true, bookableOnly: true },
          accessToken,
        )

        if (!isMounted) {
          return
        }

        setItems(nextItems)
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getCatalogErrorMessage(error, 'Unable to load the live service catalog right now.'))
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

  const serviceItems = useMemo(() => items.filter((item) => item.category === 0), [items])
  const diagnosticItems = useMemo(() => items.filter((item) => item.category === 1), [items])

  if (isLoading) {
    return (
      <div className="rounded-[1.75rem] bg-white/85 p-8 text-sm text-slate-500 shadow-panel">
        Loading live service catalog...
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="rounded-[1.75rem] border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
        {errorMessage}
      </div>
    )
  }

  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section>
        <div className="mb-5">
          <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
            Standard Services
          </p>
          <h2 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-slate-900">
            Reserve-ready services
          </h2>
        </div>

        <div className="grid gap-4">
          {serviceItems.map((item) => (
            <article key={item.id} className="rounded-[1.5rem] bg-white/90 p-6 shadow-panel">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-headline font-bold text-slate-900">{item.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
                <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">
                  {formatCurrency(item.basePrice + item.estimatedLaborCost)}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                  {formatDurationLabel(item.estimatedDuration)}
                </span>
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
                  {item.requiredParts.length} required parts
                </span>
              </div>

              {item.requiredParts.length > 0 ? (
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                    Reserved Parts
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.requiredParts.map((requiredPart) => (
                      <span
                        key={`${item.id}-${requiredPart.partId}`}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
                      >
                        {requiredPart.partName} x{requiredPart.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
            Diagnostics
          </p>
          <h2 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-slate-900">
            Parts stay untouched
          </h2>
        </div>

        <div className="grid gap-4">
          {diagnosticItems.map((item) => (
            <article key={item.id} className="rounded-[1.5rem] bg-white/90 p-6 shadow-panel">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-headline font-bold text-slate-900">{item.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
                <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-700">
                  {formatCurrency(item.basePrice + item.estimatedLaborCost)}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                  {formatDurationLabel(item.estimatedDuration)}
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                  No stock reserved on booking
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-6 text-white shadow-card">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-cyan-200">
              <MaterialIcon name="build_circle" className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-headline font-bold">After diagnostics</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                The mechanic adds the real work items and parts later from the service order workspace, so diagnostics stay safe and stock never disappears by mistake.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
