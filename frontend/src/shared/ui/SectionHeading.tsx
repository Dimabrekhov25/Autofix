import { cn } from '../lib/cn'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <div className={cn('flex flex-col gap-4', alignment, className)}>
      {eyebrow ? (
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="max-w-3xl font-heading text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base font-medium leading-7 text-ink-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
