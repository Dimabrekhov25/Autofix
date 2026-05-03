import { useTranslation } from 'react-i18next'
import { EmployeeStatisticsDto } from '../../../apis/statisticsApi'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface EmployeeCardProps {
  data: EmployeeStatisticsDto
}

export function EmployeeCard({ data }: EmployeeCardProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-lg border border-outline bg-surface p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-on-surface-variant">
            {t('app.statistics.employees.title')}
          </h3>
          <p className="mt-2 text-3xl font-bold text-on-background">
            {data.totalEmployees}
          </p>
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <MaterialIcon name="work" className="text-primary" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-on-surface-variant">
            {t('app.statistics.employees.active')}
          </p>
          <p className="mt-1 font-semibold text-on-background">
            {data.activeEmployees}
          </p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant">
            {t('app.statistics.employees.jobsCompleted')}
          </p>
          <p className="mt-1 font-semibold text-on-background">
            {data.totalJobsCompleted}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-outline-variant pt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">
              {t('app.statistics.employees.avgJobsPerEmployee')}
            </span>
            <span className="font-semibold text-on-background">
              {data.averageJobsPerEmployee.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">
              {t('app.statistics.employees.totalLaborHours')}
            </span>
            <span className="font-semibold text-on-background">
              {data.totalTeamLaborHours.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {data.topPerformers.length > 0 && (
        <div className="mt-4 border-t border-outline-variant pt-4">
          <h4 className="text-sm font-medium text-on-background">
            {t('app.statistics.employees.topPerformers')}
          </h4>
          <div className="mt-2 space-y-2">
            {data.topPerformers.map((employee, index) => (
              <div key={employee.employeeId} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-on-background">
                      {employee.employeeName}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {employee.completedJobs} {t('app.common.jobs')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
