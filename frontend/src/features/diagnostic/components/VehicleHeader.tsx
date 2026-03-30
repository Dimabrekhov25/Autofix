import type { VehicleInfo } from '../types/vehicle'

interface VehicleHeaderProps {
  vehicle: VehicleInfo
}

export function VehicleHeader({ vehicle }: VehicleHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[0.6875rem] font-label font-bold tracking-[0.1em] text-primary uppercase">
            Current Session
          </span>
          <h1 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-on-surface-variant font-medium">
            {vehicle.trim} • {vehicle.color}
          </p>
        </div>
        <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-outline-variant/10 text-center">
          <span className="block text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest">
            Plate
          </span>
          <span className="text-lg font-headline font-black text-on-surface">
            {vehicle.plateNumber}
          </span>
        </div>
      </div>
    </div>
  )
}
