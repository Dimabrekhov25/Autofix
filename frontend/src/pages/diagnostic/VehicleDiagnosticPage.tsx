import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'
import { VehicleHeader } from '../../features/vehicle/components/VehicleHeader'
import { VehicleInfoCard } from '../../features/vehicle/components/VehicleInfoCard'
import { VehicleImageSection } from '../../features/vehicle/components/VehicleImageSection'
import { ServiceHistory } from '../../features/vehicle/components/ServiceHistory'
import { DiagnosticReport } from '../../features/vehicle/components/DiagnosticReport'
import { CostCalculator } from '../../features/vehicle/components/CostCalculator'
import { mockVehicleDiagnostic } from '../../features/vehicle/mock/vehicle-data'

export function VehicleDiagnosticPage() {
  const { vehicle, serviceHistory, issues, costBreakdown } = mockVehicleDiagnostic

  const handleAddIssue = () => {
    // TODO: Implement add issue functionality
    console.log('Add issue clicked')
  }

  return (
    <DashboardShell>
      <main className="flex flex-col md:flex-row min-h-screen">
        {/* Left Section: Vehicle Info Panel */}
        <section className="flex-1 md:w-1/2 p-8 lg:p-12 overflow-y-auto bg-surface space-y-12">
          {/* Vehicle Header */}
          <VehicleHeader vehicle={vehicle} />

          {/* Vehicle Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <VehicleInfoCard label="VIN Number" value={vehicle.vin} mono />
            <VehicleInfoCard
              label="Odometer"
              value={`${vehicle.odometer.toLocaleString()} ${vehicle.odometerUnit}`}
            />
          </div>

          {/* Vehicle Visual */}
          <VehicleImageSection
            imageUrl={vehicle.imageUrl}
            batteryHealth={vehicle.batteryHealth}
          />

          {/* Service History */}
          <ServiceHistory records={serviceHistory} />
        </section>

        {/* Right Section: Issues & Cost Calculation */}
        <section className="flex-1 md:w-1/2 p-8 lg:p-12 bg-surface-container-low flex flex-col gap-8">
          <DiagnosticReport issues={issues} onAddIssue={handleAddIssue} />

          {/* Cost Calculator Sticky Bottom */}
          <CostCalculator breakdown={costBreakdown} />
        </section>
      </main>
    </DashboardShell>
  )
}
