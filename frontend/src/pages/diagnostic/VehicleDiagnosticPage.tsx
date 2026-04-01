import { useState } from 'react'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'
import { VehicleListView } from '../../features/diagnostic/components/VehicleListView'
import { DiagnosticWorkspace } from '../../features/diagnostic/components/DiagnosticWorkspace'
import { mockMechanicVehicles } from '../../features/diagnostic/mock/mechanic-data'
import type { MechanicVehicle, VehicleDiagnosticStatus, ExtendedDiagnosticIssue } from '../../features/diagnostic/types/mechanic'

export function VehicleDiagnosticPage() {
  const [vehicles, setVehicles] = useState<MechanicVehicle[]>(mockMechanicVehicles)
  const [selectedVehicle, setSelectedVehicle] = useState<MechanicVehicle | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<VehicleDiagnosticStatus | 'all'>('all')

  const handleVehicleSelect = (vehicle: MechanicVehicle) => {
    setSelectedVehicle(vehicle)
  }

  const handleBackToList = () => {
    setSelectedVehicle(null)
  }

  const handleIssuesUpdate = (issues: ExtendedDiagnosticIssue[]) => {
    if (selectedVehicle) {
      const updatedVehicles = vehicles.map((v) =>
        v.id === selectedVehicle.id ? { ...v, issues } : v
      )
      setVehicles(updatedVehicles)
      setSelectedVehicle({ ...selectedVehicle, issues })
    }
  }

  return (
    <DashboardShell>
      <main className="p-8 lg:p-12 min-h-screen bg-surface">
        {selectedVehicle ? (
          <DiagnosticWorkspace
            vehicle={selectedVehicle}
            onBack={handleBackToList}
            onIssuesUpdate={handleIssuesUpdate}
          />
        ) : (
          <VehicleListView
            vehicles={vehicles}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onVehicleSelect={handleVehicleSelect}
          />
        )}
      </main>
    </DashboardShell>
  )
}
