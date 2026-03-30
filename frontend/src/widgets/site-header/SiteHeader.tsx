import { Link, useLocation } from 'react-router-dom'

import { APP_ROUTES } from '../../shared/config/routes'
import { siteNavigation } from '../../shared/config/site-shell'
import { cn } from '../../shared/lib/cn'
import { useAuth } from '../../features/auth/useAuth'
import { BrandMark } from '../../shared/ui/BrandMark'
import { Button } from '../../shared/ui/Button'
import { Container } from '../../shared/ui/Container'
import { ServicesDropdown } from './ServicesDropdown'

export function SiteHeader() {
  const location = useLocation()
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <header className="glass-nav fixed inset-x-0 top-0 z-50">
      <Container className="flex items-center justify-between gap-6 py-4">
        <Link
          to={APP_ROUTES.home}
          aria-label="AUTOFIX home"
          className="group relative inline-flex items-center"
        >
          <span className="absolute -inset-x-3 -inset-y-2 rounded-full bg-primary/10 opacity-0 blur-md transition duration-300 group-hover:opacity-100" />
          <span className="absolute bottom-0 left-1 h-[0.2rem] w-20 rounded-full bg-primary/85" />
          <span className="absolute -right-3 top-0 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_6px_rgba(0,102,104,0.12)] transition-transform duration-300 group-hover:scale-110" />
          <BrandMark className="relative font-heading text-2xl font-black tracking-[-0.08em] text-slate-900" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {siteNavigation.map((item) => {
            const matchesPath = item.matchPaths?.includes(location.pathname) ?? false
            const matchesHash = item.matchHashes
              ? item.matchHashes.includes(location.hash)
              : true
            const isActive = matchesPath && matchesHash

            if (item.label === 'Services') {
              return (
                <ServicesDropdown
                  key={item.label}
                  isActive={isActive}
                  to={item.to}
                />
              )
            }

            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  'font-heading text-sm font-bold tracking-tight text-slate-600 transition-colors duration-300 hover:text-slate-900',
                  isActive && 'border-b-2 border-cyan-500 pb-1 text-cyan-600',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <Button to={APP_ROUTES.dashboard} tone="secondary">
              Dashboard
            </Button>
            <button
              type="button"
              onClick={logout}
              title="Mock sign out"
              className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-2 py-2 text-sm font-semibold text-slate-700 shadow-card transition hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-extrabold uppercase text-white">
                {user.initials}
              </span>
              <span className="hidden pr-2 sm:inline">{user.fullName}</span>
            </button>
          </div>
        ) : (
          <Button to={APP_ROUTES.login} tone="secondary">
            Log In
          </Button>
        )}
      </Container>
    </header>
  )
}
