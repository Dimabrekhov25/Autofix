import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getComprehensiveStatisticsRequest, ComprehensiveStatisticsDto, getStatisticsErrorMessage } from '../../apis/statisticsApi'
import { useAuth } from '../../features/auth/useAuth'
import { RevenueCard } from '../../features/statistics/components/RevenueCard'
import { OrderCard } from '../../features/statistics/components/OrderCard'
import { ServiceCard } from '../../features/statistics/components/ServiceCard'
import { InventoryCard } from '../../features/statistics/components/InventoryCard'
import { CustomerCard } from '../../features/statistics/components/CustomerCard'
import { EmployeeCard } from '../../features/statistics/components/EmployeeCard'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'
import { Button } from '../../shared/ui/Button'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'

export function StatisticsPage() {
  const { t } = useTranslation()
  const { tokens } = useAuth()
  const accessToken = tokens?.accessToken

  const [statistics, setStatistics] = useState<ComprehensiveStatisticsDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function loadStatistics(options?: { background?: boolean }) {
    const isBackgroundRefresh = options?.background ?? false

    if (!accessToken) {
      setStatistics(null)
      setErrorMessage(t('app.statistics.missingToken'))
      setIsLoading(false)
      return
    }

    if (isBackgroundRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }

    setErrorMessage(null)

    try {
      const data = await getComprehensiveStatisticsRequest(accessToken)
      setStatistics(data)
    } catch (error) {
      setErrorMessage(getStatisticsErrorMessage(error, t('app.statistics.loadError')))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    void loadStatistics()
  }, [accessToken, t])

  const generatedAt = statistics
    ? new Date(statistics.generatedAt).toLocaleString()
    : null

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <MaterialIcon name="loading" className="animate-spin text-4xl text-primary" />
            <p className="mt-4 text-on-surface-variant">
              {t('app.common.loading')}
            </p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="mb-2 text-4xl font-headline font-extrabold tracking-tight text-on-background">
                {t('app.statistics.title')}
              </h1>
              <p className="text-on-surface-variant">
                {t('app.statistics.description')}
              </p>
              {generatedAt && (
                <p className="mt-2 text-xs text-on-surface-variant">
                  {t('app.statistics.generatedAt')}: {generatedAt}
                </p>
              )}
            </div>
            <Button
              type="button"
              tone="secondary"
              onClick={() => {
                void loadStatistics({ background: true })
              }}
              disabled={isLoading || isRefreshing}
              className="min-w-40"
            >
              <MaterialIcon name="refresh" className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? t('app.common.refreshing') : t('app.common.refresh')}</span>
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="rounded-lg border border-error/30 bg-error/5 p-4">
            <div className="flex items-start gap-3">
              <MaterialIcon name="error" className="mt-0.5 text-error" />
              <div>
                <h3 className="font-medium text-error">
                  {t('app.common.error')}
                </h3>
                <p className="mt-1 text-sm text-error/80">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Grid */}
        {statistics && (
          <div className="space-y-8">
            {/* Revenue Section */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-on-background">
                {t('app.statistics.revenue.section')}
              </h2>
              <RevenueCard data={statistics.revenue} />
            </div>

            {/* Orders and Services */}
            <div className="grid gap-6 md:grid-cols-2">
              <OrderCard data={statistics.orders} />
              <ServiceCard data={statistics.services} />
            </div>

            {/* Inventory and Customers */}
            <div className="grid gap-6 md:grid-cols-2">
              <InventoryCard data={statistics.inventory} />
              <CustomerCard data={statistics.customers} />
            </div>

            {/* Employees */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-on-background">
                {t('app.statistics.employees.section')}
              </h2>
              <EmployeeCard data={statistics.employees} />
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
