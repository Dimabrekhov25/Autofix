import { useTranslation } from 'react-i18next'
import { RevenueStatisticsDto } from '../../../apis/statisticsApi'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface RevenueCardProps {
  data: RevenueStatisticsDto
}

export function RevenueCard({ data }: RevenueCardProps) {
  const { t } = useTranslation()

  const trendDirection = data.revenueTrend >= 0 ? 'up' : 'down'
  const trendColor = data.revenueTrend >= 0 ? 'text-green-500' : 'text-red-500'

  return (
    <div className="rounded-lg border border-outline bg-surface p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-on-surface-variant">
            {t('app.statistics.revenue.title')}
          </h3>
          <p className="mt-2 text-3xl font-bold text-on-background">
            ${data.totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <MaterialIcon name="trending_up" className="text-primary" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-on-surface-variant">
            {t('app.statistics.revenue.labor')}
          </p>
          <p className="mt-1 font-semibold text-on-background">
            ${data.totalLaborCost.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant">
            {t('app.statistics.revenue.parts')}
          </p>
          <p className="mt-1 font-semibold text-on-background">
            ${data.totalPartsCost.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant">
            {t('app.statistics.revenue.average')}
          </p>
          <p className="mt-1 font-semibold text-on-background">
            ${data.averageOrderValue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className={`mt-4 flex items-center gap-2 ${trendColor}`}>
        <MaterialIcon name={`trending_${trendDirection}`} />
        <span className="text-sm font-medium">
          {data.revenueTrend.toFixed(1)}% {trendDirection === 'up' ? 'growth' : 'decline'} vs last month
        </span>
      </div>
    </div>
  )
}
