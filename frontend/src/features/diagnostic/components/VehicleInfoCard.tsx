interface VehicleInfoCardProps {
  label: string
  value: string
  mono?: boolean
}

export function VehicleInfoCard({ label, value, mono = false }: VehicleInfoCardProps) {
  return (
    <div className="bg-surface-container-low p-4 rounded-xl">
      <p className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className={`text-sm ${mono ? 'font-mono' : 'font-headline font-bold'} text-on-surface`}>
        {value}
      </p>
    </div>
  )
}
