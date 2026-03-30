import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface VehicleImageSectionProps {
  imageUrl?: string
  batteryHealth?: number
}

export function VehicleImageSection({ imageUrl, batteryHealth }: VehicleImageSectionProps) {
  return (
    <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
      {imageUrl ? (
        <img
          className="w-full h-full object-cover"
          src={imageUrl}
          alt="Vehicle"
        />
      ) : (
        <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
          <MaterialIcon name="directions_car" className="text-6xl text-on-surface-variant" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 to-transparent" />
      {batteryHealth !== undefined && (
        <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
          <MaterialIcon name="electric_car" className="text-white" />
          <span className="text-white font-headline font-bold text-sm">
            Battery Health: {batteryHealth}%
          </span>
        </div>
      )}
    </div>
  )
}
