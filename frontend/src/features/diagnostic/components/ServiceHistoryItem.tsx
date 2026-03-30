import type { ServiceCategory } from '../types/vehicle'

interface ServiceHistoryItemProps {
  date: string
  category: ServiceCategory
  title: string
  description: string
  isLatest?: boolean
}

const categoryConfig: Record<ServiceCategory, { label: string; bgColor: string; textColor: string }> = {
  maintenance: {
    label: 'MAINTENANCE',
    bgColor: 'bg-primary/10',
    textColor: 'text-primary',
  },
  routine: {
    label: 'ROUTINE',
    bgColor: 'bg-surface-container-highest',
    textColor: 'text-on-surface-variant',
  },
  repair: {
    label: 'REPAIR',
    bgColor: 'bg-secondary/10',
    textColor: 'text-secondary',
  },
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase()
}

export function ServiceHistoryItem({
  date,
  category,
  title,
  description,
  isLatest = false,
}: ServiceHistoryItemProps) {
  const config = categoryConfig[category]

  return (
    <div className="relative pl-14 pb-8 group last:pb-0">
      <div
        className={`absolute left-4 top-1 w-4 h-4 rounded-full border-4 border-surface ${
          isLatest
            ? 'bg-primary ring-4 ring-primary/10'
            : 'bg-slate-300'
        }`}
      />
      <div className="bg-surface-container-low p-5 rounded-xl transition-all group-hover:bg-surface-container hover:translate-x-2">
        <div className="flex justify-between mb-2">
          <span className="text-xs font-bold text-on-surface-variant">
            {formatDate(date)}
          </span>
          <span
            className={`text-[10px] font-label font-bold px-2 py-1 ${config.bgColor} ${config.textColor} rounded-full`}
          >
            {config.label}
          </span>
        </div>
        <h4 className="font-headline font-bold text-on-surface">{title}</h4>
        <p className="text-sm text-on-surface-variant mt-1">{description}</p>
      </div>
    </div>
  )
}
