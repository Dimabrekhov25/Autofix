import { useTranslation } from 'react-i18next'
import { OrderStatisticsDto } from '../../../apis/statisticsApi'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface OrderCardProps {
  data: OrderStatisticsDto
}

export function OrderCard({ data }: OrderCardProps) {
  const { t } = useTranslation()

  const statusBreakdown = [
    { label: t('app.statistics.orders.pending'), value: data.pendingOrders, color: 'bg-yellow-500' },
    { label: t('app.statistics.orders.approved'), value: data.approvedOrders, color: 'bg-blue-500' },
    { label: t('app.statistics.orders.inProgress'), value: data.inProgressOrders, color: 'bg-purple-500' },
    { label: t('app.statistics.orders.completed'), value: data.completedOrders, color: 'bg-green-500' },
    { label: t('app.statistics.orders.cancelled'), value: data.cancelledOrders, color: 'bg-red-500' },
  ]

  return (
    <div className="rounded-lg border border-outline bg-surface p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-on-surface-variant">
            {t('app.statistics.orders.title')}
          </h3>
          <p className="mt-2 text-3xl font-bold text-on-background">
            {data.totalOrders}
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            {t('app.statistics.orders.completionRate')}: {data.completionRate.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <MaterialIcon name="assignment" className="text-primary" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {statusBreakdown.map((status) => (
          <div key={status.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${status.color}`} />
              <span className="text-sm text-on-surface-variant">{status.label}</span>
            </div>
            <span className="font-semibold text-on-background">{status.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-outline-variant pt-4">
        <p className="text-xs text-on-surface-variant">
          {t('app.statistics.orders.avgProcessingTime')}
        </p>
        <p className="mt-1 text-lg font-semibold text-on-background">
          {data.averageProcessingTimeHours.toFixed(1)} {t('app.common.hours')}
        </p>
      </div>
    </div>
  )
}
