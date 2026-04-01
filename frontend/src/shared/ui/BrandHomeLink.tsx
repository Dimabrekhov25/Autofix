import { Link } from 'react-router-dom'

import { APP_ROUTES } from '../config/routes'
import { BrandMark } from './BrandMark'

interface BrandHomeLinkProps {
  className?: string
  brandClassName?: string
}

export function BrandHomeLink({ className, brandClassName }: BrandHomeLinkProps) {
  return (
    <Link
      to={APP_ROUTES.home}
      aria-label="AUTOFIX home"
      className={[
        'group relative inline-flex items-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="absolute -inset-x-3 -inset-y-2 rounded-full bg-primary/10 opacity-0 blur-md transition duration-300 group-hover:opacity-100" />
      <span className="absolute bottom-0 left-1 h-[0.2rem] w-20 rounded-full bg-primary/85" />
      <span className="absolute -right-3 top-0 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_6px_rgba(0,102,104,0.12)] transition-transform duration-300 group-hover:scale-110" />
      <BrandMark
        className={
          brandClassName ??
          'relative font-heading text-2xl font-black tracking-[-0.08em] text-slate-900'
        }
      />
    </Link>
  )
}
