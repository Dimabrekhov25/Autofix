import type { MechanicVehicle, VehicleDiagnosticStatus } from '../types/mechanic'

interface VehicleCardProps {
  vehicle: MechanicVehicle
  onClick: () => void
}

const statusConfig: Record<
  VehicleDiagnosticStatus,
  { label: string; color: string; icon: string }
> = {
  'waiting-diagnosis': { label: 'Waiting', color: 'bg-gray-100 text-gray-700', icon: 'schedule' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: 'construction' },
  'waiting-parts': { label: 'Waiting Parts', color: 'bg-orange-100 text-orange-700', icon: 'inventory_2' },
  'pending-approval': { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: 'pending' },
  'approved': { label: 'Approved', color: 'bg-green-100 text-green-700', icon: 'check_circle' },
  'in-repair': { label: 'In Repair', color: 'bg-purple-100 text-purple-700', icon: 'build' },
  'completed': { label: 'Completed', color: 'bg-green-100 text-green-700', icon: 'done_all' },
}

export function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  const status = statusConfig[vehicle.status]
  const issueCount = vehicle.issues.filter((i) => i.priority !== 'resolved').length

  const totalCost = vehicle.issues
    .filter((i) => i.priority !== 'resolved')
    .reduce((sum, issue) => {
      const partsCost = issue.cost
      const laborCost = issue.laborHours * vehicle.laborRate
      return sum + partsCost + laborCost
    }, 0)

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface-container-lowest rounded-xl p-6 shadow-card hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Vehicle Info */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-on-surface mb-1">
            {vehicle.vehicle.year} {vehicle.vehicle.make} {vehicle.vehicle.model}
          </h3>
          <div className="text-sm text-on-surface-variant font-mono">
            {vehicle.vehicle.plateNumber}
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant text-2xl">
          directions_car
        </span>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-2 mb-3 text-sm text-on-surface-variant">
        <span className="material-symbols-outlined text-base">person</span>
        <span>{vehicle.customer.name}</span>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
          <span className="material-symbols-outlined text-sm">{status.icon}</span>
          {status.label}
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-outline-variant">
        <div className="flex items-center gap-4 text-sm">
          {issueCount > 0 && (
            <span className="flex items-center gap-1 text-error">
              <span className="material-symbols-outlined text-base">warning</span>
              {issueCount} {issueCount === 1 ? 'Issue' : 'Issues'}
            </span>
          )}
          {issueCount === 0 && vehicle.status === 'waiting-diagnosis' && (
            <span className="text-on-surface-variant">No diagnosis yet</span>
          )}
        </div>
        {totalCost > 0 && (
          <span className="text-sm font-semibold text-on-surface">
            ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        )}
      </div>
    </button>
  )
}
