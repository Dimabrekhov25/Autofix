import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import { cn } from '../../../shared/lib/cn'
import type { InventoryMetric } from '../types/inventory'

interface InventoryMetricCardsProps {
  metrics: InventoryMetric[]
}

const metricToneClassNames = {
  neutral: 'bg-white text-on-background',
  primary: 'bg-primary text-on-primary shadow-shell',
  accent: 'bg-tertiary text-on-tertiary',
} as const

export function InventoryMetricCards({ metrics }: InventoryMetricCardsProps) {
  return (
    <section className="mt-8 grid gap-6 md:grid-cols-3">
      {metrics.map((metric) => {
        const isPrimary = metric.tone === 'primary'

        return (
          <article
            key={metric.id}
            className={cn(
              'relative overflow-hidden rounded-[1.75rem] p-6 shadow-panel',
              metricToneClassNames[metric.tone],
            )}
          >
            <div className="relative z-10">
              <p
                className={cn(
                  'text-[0.6875rem] font-black uppercase tracking-[0.24em]',
                  isPrimary ? 'text-on-primary/75' : 'text-slate-400',
                )}
              >
                {metric.label}
              </p>
              <h2 className="mt-2 text-3xl font-headline font-extrabold tracking-tight">
                {metric.value}
              </h2>
              <p className={cn('mt-3 text-sm font-semibold', isPrimary ? 'text-on-primary/90' : 'text-primary')}>
                {metric.supportingText}
              </p>
            </div>

            <div
              className={cn(
                'absolute -bottom-5 -right-4 opacity-10',
                isPrimary ? 'text-on-primary opacity-20' : 'text-slate-900',
              )}
            >
              <MaterialIcon name={metric.icon} className="text-[96px]" />
            </div>
          </article>
        )
      })}
    </section>
  )
}
