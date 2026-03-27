import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import { cn } from '../../../shared/lib/cn'
import { formatCurrency, formatInteger } from '../lib/formatters'
import type { InventoryPart, InventoryPartStatus } from '../types/inventory'

interface InventoryTableProps {
  items: InventoryPart[]
  totalTrackedParts: number
}

const inventoryStatusMap: Record<
  InventoryPartStatus,
  {
    label: string
    textClassName: string
    progressClassName: string
  }
> = {
  'in-stock': {
    label: 'Optimal',
    textClassName: 'text-primary',
    progressClassName: 'bg-primary',
  },
  'low-stock': {
    label: 'Low Stock',
    textClassName: 'text-secondary',
    progressClassName: 'bg-secondary',
  },
  'out-of-stock': {
    label: 'Depleted',
    textClassName: 'text-error',
    progressClassName: 'bg-error',
  },
}

function getStockLevelWidth(quantity: number, targetQuantity: number) {
  if (targetQuantity <= 0) {
    return 0
  }

  return Math.min(100, Math.round((quantity / targetQuantity) * 100))
}

export function InventoryTable({ items, totalTrackedParts }: InventoryTableProps) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-surface-container-lowest shadow-panel">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-500">
                Part Name & ID
              </th>
              <th className="px-6 py-4 text-center text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-500">
                SKU Number
              </th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-500">
                Stock Level
              </th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-500">
                Compatibility
              </th>
              <th className="px-6 py-4 text-right text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-500">
                Unit Price
              </th>
              <th className="px-6 py-4 text-right text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="px-6 py-12 text-center text-sm font-medium text-on-surface-variant" colSpan={6}>
                  No parts match the current filters.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const statusMeta = inventoryStatusMap[item.status]
                const stockLevelWidth = getStockLevelWidth(item.quantity, item.targetQuantity)

                return (
                  <tr key={item.id} className="border-t border-slate-100/80 transition-colors hover:bg-slate-50/80">
                    <td className="px-6 py-5">
                      <div className={cn('flex items-center gap-4', item.status === 'out-of-stock' && 'opacity-75')}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-slate-100 text-slate-600">
                          <MaterialIcon name={item.icon} className="text-xl" />
                        </div>
                        <div>
                          <p className="font-headline text-base font-bold text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-xs font-medium text-on-surface-variant">
                            {item.variant} • {item.supplier}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[0.6875rem] font-bold text-slate-600">
                        {item.sku}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="w-full max-w-[140px] space-y-1.5">
                        <div
                          className={cn(
                            'flex items-center justify-between text-[0.625rem] font-bold uppercase tracking-[0.2em]',
                            statusMeta.textClassName,
                          )}
                        >
                          <span>{statusMeta.label}</span>
                          <span>
                            {item.quantity}/{item.targetQuantity}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={cn('h-full rounded-full', statusMeta.progressClassName)}
                            style={{ width: `${stockLevelWidth}%` }}
                          />
                        </div>
                        <p className="text-[0.6875rem] font-medium text-on-surface-variant">
                          Lead time: {item.leadTime}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {item.compatibility.map((vehicle) => (
                          <span
                            key={vehicle}
                            className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[0.625rem] font-bold text-slate-600"
                          >
                            {vehicle}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-headline text-base font-bold text-slate-900">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          aria-label={`Edit ${item.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-slate-600 transition-colors hover:text-primary"
                        >
                          <MaterialIcon name="edit" className="text-lg" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Reorder ${item.name}`}
                          disabled={!item.reorderAvailable}
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-lg transition-all',
                            item.reorderAvailable
                              ? 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white'
                              : 'cursor-not-allowed bg-slate-100 text-slate-400',
                          )}
                        >
                          <MaterialIcon name="shopping_cart" className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 text-xs font-medium text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing <span className="font-bold text-slate-900">{formatInteger(items.length)}</span>{' '}
          preview entries of{' '}
          <span className="font-bold text-slate-900">{formatInteger(totalTrackedParts)}</span>{' '}
          tracked parts
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400"
          >
            <MaterialIcon name="chevron_left" className="text-lg" />
          </button>
          <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-primary px-2 text-[0.6875rem] font-bold text-white">
            1
          </span>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600"
          >
            <MaterialIcon name="chevron_right" className="text-lg" />
          </button>
        </div>
      </div>
    </section>
  )
}
