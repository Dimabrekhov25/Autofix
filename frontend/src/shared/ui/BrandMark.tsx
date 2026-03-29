interface BrandMarkProps {
  className?: string
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <span className={className ?? 'font-heading text-2xl font-extrabold tracking-[-0.08em]'}>
      AUTOFIX
    </span>
  )
}
