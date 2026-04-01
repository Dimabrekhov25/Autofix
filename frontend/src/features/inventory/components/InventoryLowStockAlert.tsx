import type { InventoryAlert } from '../types/inventory'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface InventoryLowStockAlertProps {
  alert: InventoryAlert
}

export function InventoryLowStockAlert({ alert }: InventoryLowStockAlertProps) {
  return (
    <section className="mb-8 overflow-hidden rounded-[1.75rem] border-l-8 border-secondary bg-secondary-container p-5 shadow-panel">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/40 text-secondary">
            <MaterialIcon name="warning" className="text-2xl" />
          </div>
          <div>
            <h2 className="text-base font-headline font-bold text-on-secondary-container">
              {alert.title}
            </h2>
            <p className="mt-1 text-sm font-medium text-on-secondary-container/85">
              {alert.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-secondary shadow-sm transition hover:shadow-md"
        >
          {alert.actionLabel}
        </button>
      </div>
    </section>
  )
}
