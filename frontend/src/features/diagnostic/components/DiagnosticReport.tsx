import type { DiagnosticIssue } from '../types/vehicle'
import { IssueCard } from './IssueCard'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import { Button } from '../../../shared/ui/Button'

interface DiagnosticReportProps {
  issues: DiagnosticIssue[]
  onAddIssue?: () => void
}

export function DiagnosticReport({ issues, onAddIssue }: DiagnosticReportProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight">
            Diagnostic Report
          </h2>
          <p className="text-sm text-on-surface-variant">
            Real-time analysis from OBD-II Interface
          </p>
        </div>
        <Button
          tone="primary"
          onClick={onAddIssue}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-headline font-bold text-sm"
        >
          <MaterialIcon name="add" className="text-lg" />
          Add Issue
        </Button>
      </div>

      {/* Issues List */}
      <div className="flex-1 space-y-4 no-scrollbar overflow-y-auto pr-2">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  )
}
