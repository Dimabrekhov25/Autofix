import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { APP_ROUTES } from '../../shared/config/routes'
import { siteNavigation } from '../../shared/config/site-shell'
import { cn } from '../../shared/lib/cn'
import { useAuth } from '../../features/auth/useAuth'
import { BrandHomeLink } from '../../shared/ui/BrandHomeLink'
import { Button } from '../../shared/ui/Button'
import { Container } from '../../shared/ui/Container'
import { ServicesDropdown } from './ServicesDropdown'

export function SiteHeader() {
  const location = useLocation()
  const { isAuthenticated, logout, user } = useAuth()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isProfileMenuOpen])

  return (
    <header className="glass-nav fixed inset-x-0 top-0 z-50">
      <Container className="flex items-center justify-between gap-6 py-4">
        <BrandHomeLink brandClassName="relative font-heading text-2xl font-black tracking-[-0.08em] text-slate-900" />

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
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsProfileMenuOpen((value) => !value)}
              className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-2 py-2 text-sm font-semibold text-slate-700 shadow-card transition hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-extrabold uppercase text-white">
                {user.initials}
              </span>
              <span className="hidden pr-2 sm:inline">{user.fullName}</span>
              <MaterialIcon
                name={isProfileMenuOpen ? 'expand_less' : 'expand_more'}
                className="mr-1 text-[1.15rem] text-slate-500"
              />
            </button>

            {isProfileMenuOpen ? (
              <div
                className="absolute right-0 top-[calc(100%+0.75rem)] min-w-[13rem] overflow-hidden rounded-3xl border border-white/85 bg-white/95 p-2 shadow-[0_28px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl"
                role="menu"
              >
                <Link
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/80 hover:text-slate-900"
                  onClick={() => setIsProfileMenuOpen(false)}
                  role="menuitem"
                  to={APP_ROUTES.dashboard}
                >
                  <MaterialIcon className="text-[1.15rem] text-primary" name="dashboard" />
                  <span>Dashboard</span>
                </Link>
                <button
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100/80 hover:text-error"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    void logout()
                  }}
                  role="menuitem"
                  type="button"
                >
                  <MaterialIcon className="text-[1.15rem]" name="logout" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : null}
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
