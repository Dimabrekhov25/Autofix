import { cn } from '../lib/cn'

interface MaterialIconProps {
  name: string
  className?: string
}

const materialIconAliases: Record<string, string> = {
  earth_engine: 'build',
  oil_barrel: 'local_gas_station',
  tire_repair: 'trip_origin',
  settings_input_component: 'tune',
}

export function MaterialIcon({ name, className }: MaterialIconProps) {
  const resolvedName = materialIconAliases[name] ?? name

  return (
    <span aria-hidden="true" className={cn('material-symbols-outlined', className)}>
      {resolvedName}
    </span>
  )
}
