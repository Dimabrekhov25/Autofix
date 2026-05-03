import { useTranslation } from 'react-i18next'
import { InventoryStatisticsDto } from '../../../apis/statisticsApi'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface InventoryCardProps {
  data: InventoryStatisticsDto
}

export function InventoryCard({ data }: InventoryCardProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-lg border border-outline bg-surface p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-on-surface-variant">
            {t('app.statistics.inventory.title')}
          </h3>
          <p className="mt-2 text-3xl font-bold text-on-background">
            {data.totalParts}
          </p>
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <MaterialIcon name="inventory_2" className="text-primary" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-on-surface-variant">
            {t('app.statistics.inventory.inStock')}
          </p>
          <p className="mt-1 font-semibold text-on-background">
            {data.partsInStock}
          </p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant">
            {t('app.statistics.inventory.value')}
          </p>
          <p className="mt-1 font-semibold text-on-background">
            ${data.totalInventoryValue.toFixed(2)}
          </p>
        </div>
      </div>

      {data.partsBelowMinimum > 0 && (
        <div className="mt-4 rounded-md border border-warning/30 bg-warning/5 p-3">
          <div className="flex items-center gap-2">
            <MaterialIcon name="warning" className="text-warning" />
            <div>
              <p className="text-sm font-medium text-warning">
                {t('app.statistics.inventory.lowStock')}
              </p>
              <p className="text-xs text-warning/80">
                {data.partsBelowMinimum} {t('app.common.items')}
              </p>
            </div>
          </div>
        </div>
      )}

      {data.lowStockParts.length > 0 && (
        <div className="mt-4 border-t border-outline-variant pt-4">
          <h4 className="text-sm font-medium text-on-background">
            {t('app.statistics.inventory.criticalItems')}
          </h4>
          <div className="mt-2 space-y-1">
            {data.lowStockParts.slice(0, 3).map((part) => (
              <p key={part.partId} className="text-xs text-on-surface-variant">
                {part.partName}: {part.quantityOnHand}/{part.minLevel}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
