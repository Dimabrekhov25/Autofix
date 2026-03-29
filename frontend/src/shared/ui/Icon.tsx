import type { SVGProps } from 'react'

import { cn } from '../lib/cn'
import type { IconName } from '../types/content'

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
}

export function Icon({ name, className, ...props }: IconProps) {
  const commonProps = {
    className: cn('h-5 w-5', className),
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
    ...props,
  }

  switch (name) {
    case 'calendar':
      return (
        <svg aria-hidden="true" {...commonProps}>
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      )
    case 'diagnostics':
      return (
        <svg aria-hidden="true" {...commonProps}>
          <circle cx="11" cy="11" r="6" />
          <path d="M21 21l-4.35-4.35M11 8v3l2 2" />
        </svg>
      )
    case 'inventory':
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
          <path d="M4 7.5V16l8 5 8-5V7.5" />
          <path d="M12 12v9" />
        </svg>
      )
    case 'payments':
      return (
        <svg aria-hidden="true" {...commonProps}>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="M3 10h18M7 15h3" />
        </svg>
      )
    case 'tracking':
      return (
        <svg aria-hidden="true" {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="M12 4v2M20 12h-2M12 20v-2M4 12h2" />
        </svg>
      )
    case 'history':
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="M4 5v6h6" />
          <path d="M20 12a8 8 0 1 1-2.34-5.66L20 8" />
          <path d="M12 8v5l3 2" />
        </svg>
      )
    case 'phone':
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="M5 4h3l2 5-2 1.5A16 16 0 0 0 13.5 16L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
      )
    case 'location':
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      )
    case 'clock':
      return (
        <svg aria-hidden="true" {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v5l3 2" />
        </svg>
      )
    case 'star':
      return (
        <svg aria-hidden="true" className={cn('h-4 w-4', className)} viewBox="0 0 24 24" {...props}>
          <path
            d="m12 3.5 2.75 5.57 6.15.9-4.45 4.33 1.05 6.12L12 17.5l-5.5 2.92 1.05-6.12L3.1 9.97l6.15-.9L12 3.5Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      )
    case 'chevronLeft':
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="m15 6-6 6 6 6" />
        </svg>
      )
    case 'chevronRight':
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      )
    case 'quote':
      return (
        <svg aria-hidden="true" className={cn('h-12 w-12', className)} viewBox="0 0 24 24" {...props}>
          <path
            d="M10.5 7.5A6 6 0 0 0 4.5 13v3.5A2.5 2.5 0 0 0 7 19h2.5A2.5 2.5 0 0 0 12 16.5V14A2.5 2.5 0 0 0 9.5 11.5H8A4.5 4.5 0 0 1 10.5 7.5Zm9 0A6 6 0 0 0 13.5 13v3.5A2.5 2.5 0 0 0 16 19h2.5A2.5 2.5 0 0 0 21 16.5V14a2.5 2.5 0 0 0-2.5-2.5H17A4.5 4.5 0 0 1 19.5 7.5Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      )
    case 'arrowRight':
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )
    case 'facebook':
      return (
        <svg aria-hidden="true" className={cn('h-4 w-4', className)} viewBox="0 0 24 24" {...props}>
          <path
            d="M14 8h2V4h-2a5 5 0 0 0-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9a1 1 0 0 1 1-1Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      )
    case 'share':
      return (
        <svg aria-hidden="true" {...commonProps}>
          <circle cx="18" cy="5" r="2.5" />
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="19" r="2.5" />
          <path d="m8.2 11 7.6-4.2M8.2 13 15.8 17.2" />
        </svg>
      )
    default:
      return null
  }
}
