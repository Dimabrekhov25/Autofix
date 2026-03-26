import { cn } from '../lib/cn'

interface MaterialIconProps {
  name: string
  className?: string
}

export function MaterialIcon({ name, className }: MaterialIconProps) {
  return (
    <span aria-hidden="true" className={cn('material-symbols-outlined', className)}>
      {name}
    </span>
  )
}
