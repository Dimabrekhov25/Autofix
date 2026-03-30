import type { ExtendedDiagnosticIssue } from '../types/mechanic'

interface DiagnosticSummaryProps {
  issues: ExtendedDiagnosticIssue[]
  laborRate: number
  onSendToClient: () => void
  onSaveDraft: () => void
  canSendToClient: boolean
}

export function DiagnosticSummary({
  issues,
  laborRate,
  onSendToClient,
  onSaveDraft,
  canSendToClient,
}: DiagnosticSummaryProps) {
  // Calculate totals
  const activeIssues = issues.filter((i) => i.priority !== 'resolved')

  const totalLaborHours = activeIssues.reduce((sum, issue) => sum + (issue.laborHours || 0), 0)

  const totalPartsCost = activeIssues.reduce((sum, issue) => sum + issue.cost, 0)

  const totalLaborCost = totalLaborHours * laborRate

  const diagnosticFee = activeIssues.length > 0 ? 95 : 0

  const grandTotal = totalPartsCost + totalLaborCost + diagnosticFee

  const hasPartsToOrder = activeIssues.some(
    (issue) => issue.parts?.some((part) => part.availability === 'need-to-order')
  )

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-card">
      <h3 className="text-xl font-semibold text-on-surface mb-6">Diagnostic Summary</h3>

      {/* Cost Breakdown */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant">Parts & Materials</span>
          <span className="font-medium text-on-surface">
            ${totalPartsCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant">
            Labor ({totalLaborHours.toFixed(2)} hrs @ ${laborRate}/hr)
          </span>
          <span className="font-medium text-on-surface">
            ${totalLaborCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {diagnosticFee > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Diagnostic Fee</span>
            <span className="font-medium text-on-surface">
              ${diagnosticFee.toFixed(2)}
            </span>
          </div>
        )}

        <div className="h-px bg-outline-variant my-4" />

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-on-surface">Total Estimate</span>
          <span className="text-2xl font-bold text-primary">
            ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Status Indicators */}
      {hasPartsToOrder && (
        <div className="bg-orange-100 text-orange-700 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="material-symbols-outlined flex-shrink-0">info</span>
          <div>
            <p className="font-medium mb-1">Parts Need Ordering</p>
            <p className="text-sm">Some parts are not in stock and need to be ordered before proceeding.</p>
          </div>
        </div>
      )}

      {!canSendToClient && activeIssues.length === 0 && (
        <div className="bg-gray-100 text-gray-700 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="material-symbols-outlined flex-shrink-0">info</span>
          <div>
            <p className="font-medium">No Issues Added</p>
            <p className="text-sm">Add at least one issue to send estimate to client.</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSaveDraft}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-surface-container hover:bg-surface-container-high rounded-xl text-on-surface font-medium transition-colors"
        >
          <span className="material-symbols-outlined">save</span>
          Save Draft
        </button>

        <button
          onClick={onSendToClient}
          disabled={!canSendToClient}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
            canSendToClient
              ? 'bg-primary hover:bg-primary-dim text-on-primary'
              : 'bg-surface-container text-on-surface-variant cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined">send</span>
          Send to Client
        </button>
      </div>
    </div>
  )
}
