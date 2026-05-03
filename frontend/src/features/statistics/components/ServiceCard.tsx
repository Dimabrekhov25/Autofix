import { useTranslation } from 'react-i18next'
import { ServiceStatisticsDto } from '../../../apis/statisticsApi'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface ServiceCardProps {
  data: ServiceStatisticsDto
}

export function ServiceCard({ data }: ServiceCardProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-lg border border-outline bg-surface p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-on-surface-variant">
            {t('app.statistics.services.title')}
          </h3>
          <p className="mt-2 text-3xl font-bold text-on-background">
            {data.totalUniqueServices}
          </p>
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <MaterialIcon name="build" className="text-primary" />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-on-surface-variant">
          {t('app.statistics.services.requested')}
        </p>
        <p className="mt-1 text-lg font-semibold text-on-background">
          {data.servicesRequested}
        </p>
      </div>

      <div className="mt-4 border-t border-outline-variant pt-4">
        <h4 className="text-sm font-medium text-on-background">
          {t('app.statistics.services.topServices')}
        </h4>
        <div className="mt-3 space-y-2">
          {data.topServices.slice(0, 5).map((service) => (
            <div key={service.serviceId} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-on-background">{service.serviceName}</p>
                <p className="text-xs text-on-surface-variant">
                  {service.timesRequested} {t('app.common.times')}
                </p>
              </div>
              <p className="font-semibold text-on-background">
                ${service.totalRevenue.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
