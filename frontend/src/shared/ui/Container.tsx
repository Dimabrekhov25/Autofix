import type { PropsWithChildren } from 'react'

import { cn } from '../lib/cn'

interface ContainerProps extends PropsWithChildren {
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return <div className={cn('section-frame', className)}>{children}</div>
}
