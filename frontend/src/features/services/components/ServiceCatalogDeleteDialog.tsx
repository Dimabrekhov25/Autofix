import { Button } from '../../../shared/ui/Button'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface ServiceCatalogDeleteDialogProps {
  itemName: string
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ServiceCatalogDeleteDialog({
  itemName,
  isDeleting,
  onCancel,
  onConfirm,
}: ServiceCatalogDeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[1.75rem] bg-white p-8 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
            <MaterialIcon name="delete_forever" className="text-2xl" />
          </div>
          <div>
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
              Delete Catalog Item
            </p>
            <h2 className="mt-2 font-headline text-2xl font-extrabold tracking-tight text-slate-900">
              Remove {itemName}?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Existing booking history stays intact, but this catalog item will no longer be offered for new bookings.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <Button type="button" tone="secondary" onClick={onCancel}>
            Keep Item
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-error text-white hover:bg-error/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}
