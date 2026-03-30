import type { DiagnosticIssue, IssuePriority } from '../types/vehicle'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface IssueCardProps {
  issue: DiagnosticIssue
}

const priorityConfig: Record<
  IssuePriority,
  {
    label: string
    icon: string
    iconFill?: boolean
    borderColor: string
    badgeBg: string
    badgeText: string
  }
> = {
  high: {
    label: 'Requires Immediate Attention',
    icon: 'error',
    iconFill: true,
    borderColor: 'border-secondary',
    badgeBg: 'bg-secondary/10',
    badgeText: 'text-secondary',
  },
  medium: {
    label: 'Maintenance Recommendation',
    icon: 'info',
    borderColor: 'border-tertiary',
    badgeBg: 'bg-tertiary/10',
    badgeText: 'text-tertiary',
  },
  resolved: {
    label: 'Issue Resolved',
    icon: 'check_circle',
    iconFill: true,
    borderColor: 'border-primary/40',
    badgeBg: 'bg-primary/10',
    badgeText: 'text-primary',
  },
}

export function IssueCard({ issue }: IssueCardProps) {
  const config = priorityConfig[issue.priority]
  const isResolved = issue.priority === 'resolved'

  return (
    <div
      className={`bg-surface-container-lowest p-6 rounded-2xl border-l-4 ${config.borderColor} ${
        isResolved ? 'opacity-75' : 'shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MaterialIcon
              name={config.icon}
              className={`text-sm ${config.badgeText}`}
            />
            <span
              className={`text-[10px] font-label font-bold ${config.badgeText} uppercase tracking-[0.15em]`}
            >
              {config.label}
            </span>
          </div>
          <h3 className="text-lg font-headline font-bold text-on-surface">
            {issue.title}
          </h3>
          <p className="text-xs text-on-surface-variant">{issue.description}</p>
        </div>
        <div className="text-right">
          <span
            className={`text-xl font-headline font-extrabold ${
              isResolved ? 'text-on-surface-variant' : 'text-on-surface'
            }`}
          >
            ${issue.cost.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Parts and Labor Info */}
      {!isResolved && (issue.parts || issue.laborHours) && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-surface-container">
          {issue.parts &&
            issue.parts.map((part) => (
              <div
                key={part.id}
                className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg"
              >
                <MaterialIcon name="inventory_2" className="text-primary text-sm" />
                <span className="text-xs font-medium text-on-surface">
                  {part.name}
                </span>
                {part.inStock && (
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 rounded">
                    IN STOCK
                  </span>
                )}
              </div>
            ))}

          {issue.laborHours && (
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg">
              <MaterialIcon name="person" className="text-primary text-sm" />
              <span className="text-xs font-medium text-on-surface">
                Labor: {issue.laborHours} hrs
              </span>
            </div>
          )}
        </div>
      )}

      {/* Assign Parts Button for Medium Priority Without Parts */}
      {issue.priority === 'medium' && !issue.hasPartsAssigned && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-surface-container">
          <button className="flex items-center gap-2 border border-outline-variant/30 hover:bg-surface-container-low px-3 py-1.5 rounded-lg transition-colors">
            <MaterialIcon name="add_circle" className="text-on-surface-variant text-sm" />
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Assign Parts
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
