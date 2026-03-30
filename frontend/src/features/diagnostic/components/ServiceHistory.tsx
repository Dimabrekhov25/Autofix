import type { ServiceRecord } from '../types/vehicle'
import { ServiceHistoryItem } from './ServiceHistoryItem'
import { Button } from '../../../shared/ui/Button'

interface ServiceHistoryProps {
  records: ServiceRecord[]
}

export function ServiceHistory({ records }: ServiceHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-headline font-bold text-on-surface">
          Service History
        </h2>
        <Button
          tone="ghost"
          className="!text-primary !font-label !text-xs !font-bold !uppercase !tracking-wider !px-0 hover:underline"
        >
          View Full Log
        </Button>
      </div>
      <div className="relative space-y-0">
        {/* Vertical Timeline Track */}
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-surface-container-highest" />
        {records.map((record, index) => (
          <ServiceHistoryItem
            key={record.id}
            date={record.date}
            category={record.category}
            title={record.title}
            description={record.description}
            isLatest={index === 0}
          />
        ))}
      </div>
    </div>
  )
}
