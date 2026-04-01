import { Link } from 'react-router-dom'

import { HOME_SECTION_ROUTES } from '../../../shared/config/routes'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface ServiceBreadcrumbProps {
  label: string
  currentPage: string
}

export function ServiceBreadcrumb({ label, currentPage }: ServiceBreadcrumbProps) {
  return (
    <nav className="mb-8 flex items-center gap-2 text-sm text-on-surface-variant">
      <Link to={HOME_SECTION_ROUTES.services} className="transition-colors hover:text-primary">
        {label}
      </Link>
      <MaterialIcon name="chevron_right" className="text-base" />
      <span className="font-medium text-on-surface">{currentPage}</span>
    </nav>
  )
}
