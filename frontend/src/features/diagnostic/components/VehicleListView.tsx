import type { MechanicVehicle, VehicleDiagnosticStatus } from '../types/mechanic'
import { VehicleCard } from './VehicleCard'
import { VehicleSearch } from './VehicleSearch'

interface VehicleListViewProps {
  vehicles: MechanicVehicle[]
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: VehicleDiagnosticStatus | 'all'
  onStatusFilterChange: (status: VehicleDiagnosticStatus | 'all') => void
  onVehicleSelect: (vehicle: MechanicVehicle) => void
}

export function VehicleListView({
  vehicles,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onVehicleSelect,
}: VehicleListViewProps) {
  // Filter vehicles
  const filteredVehicles = vehicles.filter((vehicle) => {
    // Status filter
    if (statusFilter !== 'all' && vehicle.status !== statusFilter) {
      return false
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const vehicleText = `${vehicle.vehicle.make} ${vehicle.vehicle.model} ${vehicle.vehicle.plateNumber}`.toLowerCase()
      const customerText = vehicle.customer.name.toLowerCase()
      return vehicleText.includes(query) || customerText.includes(query)
    }

    return true
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-on-surface mb-2">My Vehicles</h1>
        <p className="text-on-surface-variant">
          {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} assigned
        </p>
      </div>

      {/* Search & Filter */}
      <VehicleSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
      />

      {/* Vehicle Grid */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onClick={() => onVehicleSelect(vehicle)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
            directions_car_filled
          </span>
          <h3 className="text-xl font-semibold text-on-surface mb-2">No vehicles found</h3>
          <p className="text-on-surface-variant text-center max-w-md">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No vehicles assigned to you at the moment'}
          </p>
        </div>
      )}
    </div>
  )
}
