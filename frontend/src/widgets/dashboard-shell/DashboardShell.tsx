import type { PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '../../features/auth/useAuth'
import { isAdminUser } from '../../features/auth/auth-types'
import { APP_ROUTES } from '../../shared/config/routes'
import { BrandHomeLink } from '../../shared/ui/BrandHomeLink'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'

interface DashboardShellProps extends PropsWithChildren {
  searchPlaceholder?: string
}

const dashboardNavItems = [
  { label: 'Dashboard', to: APP_ROUTES.dashboard, icon: 'dashboard', adminOnly: false },
  { label: 'Diagnostic', to: APP_ROUTES.diagnostics, icon: 'build', adminOnly: true },
  { label: 'Awaiting Customer', to: APP_ROUTES.awaitingCustomer, icon: 'schedule', adminOnly: true },
  { label: 'Active Jobs', to: APP_ROUTES.activeJobs, icon: 'directions_car', adminOnly: true },
  { label: 'Inventory', to: APP_ROUTES.inventory, icon: 'inventory_2', adminOnly: true },
  { label: 'Parts Catalog', to: APP_ROUTES.partsCatalog, icon: 'settings_suggest', adminOnly: true },
  { label: 'Booking', to: APP_ROUTES.booking, icon: 'event', adminOnly: false },
  { label: 'Services', to: APP_ROUTES.services, icon: 'settings', adminOnly: false },
] as const

export function DashboardShell({
  children,
  searchPlaceholder = 'Search repairs or vehicles...',
}: DashboardShellProps) {
  const { logout, user } = useAuth()
  const isAdmin = isAdminUser(user)
  const visibleNavItems = dashboardNavItems.filter((item) => !item.adminOnly || isAdmin)

  return (
    <div className="min-h-screen bg-surface text-on-background">
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col gap-2 bg-slate-50 p-4 pt-6 lg:flex">
        <div className="mb-8 px-4">
          <BrandHomeLink
            brandClassName="relative font-headline text-xl font-bold tracking-tight text-slate-900"
          />
        </div>

        <nav className="flex flex-col gap-1">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium tracking-wide transition-all duration-150',
                  isActive
                    ? 'bg-white text-cyan-600 shadow-panel'
                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900',
                ].join(' ')
              }
            >
              <MaterialIcon name={item.icon} className="text-[20px]" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-outline-variant/10 pt-4 mt-auto">
          <button
            type="button"
            onClick={() => {
              void logout()
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-slate-600 transition-colors hover:text-error"
          >
            <MaterialIcon name="logout" className="text-lg" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between bg-white/70 px-4 shadow-sm backdrop-blur-xl sm:px-6 lg:left-64 lg:px-8">
        <div className="flex items-center gap-4">
          <BrandHomeLink
            className="lg:hidden"
            brandClassName="relative font-headline text-lg font-bold tracking-tight text-slate-900"
          />
          <label className="relative hidden sm:block">
            <MaterialIcon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-56 rounded-full border-none bg-surface-container-low py-2 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-primary/20 lg:w-64"
            />
          </label>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100/50"
            >
              <MaterialIcon name="notifications" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-secondary" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100/50"
            >
              <MaterialIcon name="settings" />
            </button>
          </div>

          <div className="hidden h-8 w-px bg-outline-variant/20 sm:block" />

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="font-headline text-sm font-bold leading-none text-slate-900">
                {user?.fullName ?? 'Alex Sterling'}
              </p>
              <p className="text-[0.6875rem] font-medium text-on-surface-variant">
                Premium Member
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-container bg-white font-headline text-xs font-bold uppercase text-primary shadow-sm">
              {user?.initials ?? 'AS'}
            </div>
          </div>
        </div>
      </header>

      <div className="pt-20 lg:ml-64">
        <main className="px-4 pb-12 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  )
}
