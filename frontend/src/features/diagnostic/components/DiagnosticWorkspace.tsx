import { useState } from 'react'
import type { MechanicVehicle, ExtendedDiagnosticIssue, IssueFormData } from '../types/mechanic'
import type { DiagnosticIssue } from '../types/vehicle'
import { CustomerInfo } from './CustomerInfo'
import { IssueCard } from './IssueCard'
import { DiagnosticSummary } from './DiagnosticSummary'
import { AddIssueModal } from './AddIssueModal'

// Adapter function to convert ExtendedDiagnosticIssue to DiagnosticIssue
function convertToDisplayIssue(issue: ExtendedDiagnosticIssue): DiagnosticIssue {
  return {
    id: issue.id,
    priority: issue.priority,
    title: issue.title,
    description: issue.description,
    cost: issue.cost,
    laborHours: issue.laborHours,
    parts: issue.parts?.map((p) => ({
      id: p.id,
      name: p.name,
      inStock: p.availability === 'in-stock',
    })),
    hasPartsAssigned: issue.hasPartsAssigned,
  }
}

interface DiagnosticWorkspaceProps {
  vehicle: MechanicVehicle
  onBack: () => void
  onIssuesUpdate: (issues: ExtendedDiagnosticIssue[]) => void
}

export function DiagnosticWorkspace({ vehicle, onBack, onIssuesUpdate }: DiagnosticWorkspaceProps) {
  const [isAddIssueOpen, setIsAddIssueOpen] = useState(false)
  const [issues, setIssues] = useState<ExtendedDiagnosticIssue[]>(vehicle.issues)

  const handleAddIssue = (formData: IssueFormData) => {
    const partsTotal = 0 // In real app, calculate from parts database
    
    const newIssue: ExtendedDiagnosticIssue = {
      id: crypto.randomUUID(),
      priority: 'high',
      title: formData.title,
      description: formData.description,
      cost: partsTotal,
      laborHours: formData.laborHours,
      parts: formData.parts.map((p) => ({
        id: crypto.randomUUID(),
        name: p.name,
        availability: p.availability,
      })),
      isOptional: formData.isOptional,
      hasPartsAssigned: formData.parts.length > 0,
    }

    const updatedIssues = [...issues, newIssue]
    setIssues(updatedIssues)
    onIssuesUpdate(updatedIssues)
  }

  const handleDeleteIssue = (issueId: string) => {
    const updatedIssues = issues.filter((i) => i.id !== issueId)
    setIssues(updatedIssues)
    onIssuesUpdate(updatedIssues)
  }

  const handleSendToClient = () => {
    alert(`Diagnostic report sent to ${vehicle.customer.name}`)
    // In real app: API call to send report
    onBack()
  }

  const handleSaveDraft = () => {
    alert('Draft saved successfully')
    // In real app: API call to save draft
  }

  const activeIssues = issues.filter((i) => i.priority !== 'resolved')
  const canSendToClient = activeIssues.length > 0

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary-dim mb-6 transition-colors group"
      >
        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
          arrow_back
        </span>
        <span className="font-medium">Back to Vehicles</span>
      </button>

      {/* Vehicle Header */}
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-on-surface mb-2">
              {vehicle.vehicle.year} {vehicle.vehicle.make} {vehicle.vehicle.model}
            </h1>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <span className="flex items-center gap-1 text-lg font-mono font-medium">
                <span className="material-symbols-outlined">badge</span>
                {vehicle.vehicle.plateNumber}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined">speed</span>
                {vehicle.vehicle.odometer.toLocaleString()} {vehicle.vehicle.odometerUnit}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-primary text-5xl">
            directions_car
          </span>
        </div>

        <div className="text-sm text-on-surface-variant">
          VIN: {vehicle.vehicle.vin}
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6">
        <CustomerInfo customer={vehicle.customer} />
      </div>

      {/* Issues Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-on-surface">Diagnostic Issues</h2>
          <button
            onClick={() => setIsAddIssueOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dim text-on-primary rounded-xl font-medium transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Add Issue
          </button>
        </div>

        {issues.length > 0 ? (
          <div className="space-y-4">
            {issues.map((issue) => (
              <div 
                key={issue.id} 
                className={`relative group ${issue.priority !== 'resolved' ? 'pr-16' : ''}`}
              >
                <IssueCard issue={convertToDisplayIssue(issue)} />
                {issue.priority !== 'resolved' && (
                  <button
                    onClick={() => handleDeleteIssue(issue.id)}
                    className="absolute top-4 right-4 p-2 bg-error-container hover:bg-error text-on-error-container hover:text-on-primary rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    title="Delete issue"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 inline-block">
              engineering
            </span>
            <h3 className="text-xl font-semibold text-on-surface mb-2">No Issues Found Yet</h3>
            <p className="text-on-surface-variant mb-6">
              Start diagnosing this vehicle by adding issues
            </p>
            <button
              onClick={() => setIsAddIssueOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dim text-on-primary rounded-xl font-medium transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
              Add First Issue
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <DiagnosticSummary
        issues={issues}
        laborRate={vehicle.laborRate}
        onSendToClient={handleSendToClient}
        onSaveDraft={handleSaveDraft}
        canSendToClient={canSendToClient}
      />

      {/* Add Issue Modal */}
      <AddIssueModal
        isOpen={isAddIssueOpen}
        onClose={() => setIsAddIssueOpen(false)}
        onSave={handleAddIssue}
        laborRate={vehicle.laborRate}
      />
    </div>
  )
}
