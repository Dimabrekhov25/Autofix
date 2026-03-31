import { APP_ROUTES } from '../../../shared/config/routes'
import { Button } from '../../../shared/ui/Button'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface InventoryHeaderProps {
  trackedParts: number
}

export function InventoryHeader({ trackedParts }: InventoryHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[0.6875rem] font-black uppercase tracking-[0.24em] text-primary">
          Internal Ops
        </span>
        <div>
          <h1 className="text-4xl font-headline font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Parts Inventory
          </h1>
          <p className="mt-2 text-sm font-medium text-on-surface-variant sm:text-base">
            Currently managing{' '}
            <span className="font-bold text-primary">{trackedParts.toLocaleString()}</span>{' '}
            discrete mechanical components.
          </p>
        </div>
      </div>

      <Button to={APP_ROUTES.inventoryAddPart} className="px-5 py-3 text-sm">
        <MaterialIcon name="add" className="text-lg" />
        <span>Add New Part</span>
      </Button>
    </div>
  )
}
