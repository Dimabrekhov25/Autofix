import { useTranslation } from 'react-i18next'
import { CustomerStatisticsDto } from '../../../apis/statisticsApi'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface CustomerCardProps {
  data: CustomerStatisticsDto
}

export function CustomerCard({ data }: CustomerCardProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-lg border border-outline bg-surface p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-on-surface-variant">
            {t('app.statistics.customers.title')}
          </h3>
          <p className="mt-2 text-3xl font-bold text-on-background">
            {data.totalCustomers}
          </p>
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <MaterialIcon name="people" className="text-primary" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-on-surface-variant">
            {t('app.statistics.customers.active')}
          </span>
          <span className="font-semibold text-on-background">
            {data.activeCustomers}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-on-surface-variant">
            {t('app.statistics.customers.newThisMonth')}
          </span>
          <span className="font-semibold text-green-500">
            +{data.newCustomersThisMonth}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-on-surface-variant">
            {t('app.statistics.customers.retentionRate')}
          </span>
          <span className="font-semibold text-on-background">
            {data.customerRetentionRate.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-outline-variant pt-4">
        <p className="text-xs text-on-surface-variant">
          {t('app.statistics.customers.avgLifetimeValue')}
        </p>
        <p className="mt-1 text-lg font-semibold text-on-background">
          ${data.averageCustomerLifetimeValue.toFixed(2)}
        </p>
      </div>

      <div className="mt-3 text-xs text-on-surface-variant">
        <p>{data.totalBookings} {t('app.common.bookings')} (avg ${data.averageBookingValue.toFixed(2)})</p>
      </div>
    </div>
  )
}
