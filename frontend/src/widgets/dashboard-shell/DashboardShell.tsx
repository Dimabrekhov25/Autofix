import { type PropsWithChildren, useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import {
  getCustomerApprovalNotificationsRequest,
  getServiceOrdersErrorMessage,
  markCustomerApprovalNotificationReadRequest,
  type ServiceOrderApprovalNotificationDto,
} from '../../apis/serviceOrdersApi'
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

const approvalNotificationsRefreshEvent = 'autofix:refresh-approval-notifications'

const notificationDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const notificationCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function DashboardShell({
  children,
  searchPlaceholder = 'Search repairs or vehicles...',
}: DashboardShellProps) {
  const { logout, tokens, user } = useAuth()
  const isAdmin = isAdminUser(user)
  const visibleNavItems = dashboardNavItems.filter((item) => !item.adminOnly || isAdmin)
  const accessToken = tokens?.accessToken
  const navigate = useNavigate()
  const location = useLocation()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false)
  const [notificationErrorMessage, setNotificationErrorMessage] = useState<string | null>(null)
  const [approvalNotifications, setApprovalNotifications] = useState<ServiceOrderApprovalNotificationDto[]>([])

  useEffect(() => {
    if (!isAdmin || !accessToken) {
      setApprovalNotifications([])
      setNotificationErrorMessage(null)
      setIsNotificationsLoading(false)
      return
    }

    let isMounted = true

    async function loadNotifications(showLoading: boolean) {
      if (showLoading) {
        setIsNotificationsLoading(true)
      }

      try {
        const nextNotifications = await getCustomerApprovalNotificationsRequest(accessToken)

        if (!isMounted) {
          return
        }

        setApprovalNotifications(nextNotifications)
        setNotificationErrorMessage(null)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setNotificationErrorMessage(
          getServiceOrdersErrorMessage(error, 'Unable to load approval notifications.'),
        )
      } finally {
        if (isMounted && showLoading) {
          setIsNotificationsLoading(false)
        }
      }
    }

    void loadNotifications(true)

    const intervalId = window.setInterval(() => {
      void loadNotifications(false)
    }, 10000)

    const handleRefreshRequest = () => {
      void loadNotifications(false)
    }

    const handleWindowFocus = () => {
      void loadNotifications(false)
    }

    window.addEventListener(approvalNotificationsRefreshEvent, handleRefreshRequest)
    window.addEventListener('focus', handleWindowFocus)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
      window.removeEventListener(approvalNotificationsRefreshEvent, handleRefreshRequest)
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [accessToken, isAdmin])

  useEffect(() => {
    setIsNotificationsOpen(false)
  }, [location.pathname, location.search])

  async function handleNotificationClick(notification: ServiceOrderApprovalNotificationDto) {
    if (!accessToken) {
      return
    }

    setNotificationErrorMessage(null)

    try {
      await markCustomerApprovalNotificationReadRequest(notification.serviceOrderId, accessToken)
      setApprovalNotifications((currentNotifications) =>
        currentNotifications.filter(
          (currentNotification) => currentNotification.serviceOrderId !== notification.serviceOrderId,
        ),
      )
    } catch (error) {
      setNotificationErrorMessage(
        getServiceOrdersErrorMessage(error, 'Unable to mark this approval notification as read.'),
      )
    }

    navigate(`${APP_ROUTES.activeJobs}?bookingId=${notification.bookingId}`)
    setIsNotificationsOpen(false)
  }

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
            <span className="text-xs font-medium">Log out</span>
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
            <div className="relative">
              <button
                type="button"
                aria-haspopup={isAdmin ? 'dialog' : undefined}
                aria-expanded={isAdmin ? isNotificationsOpen : undefined}
                onClick={() => {
                  if (!isAdmin) {
                    return
                  }

                  if (!isNotificationsOpen) {
                    window.dispatchEvent(new Event(approvalNotificationsRefreshEvent))
                  }

                  setIsNotificationsOpen((currentValue) => !currentValue)
                }}
                className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100/50"
              >
                <MaterialIcon name="notifications" />
                {approvalNotifications.length > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[0.625rem] font-black text-white">
                    {approvalNotifications.length > 9 ? '9+' : approvalNotifications.length}
                  </span>
                ) : null}
              </button>

              {isAdmin && isNotificationsOpen ? (
                <div className="absolute right-0 top-14 z-[60] w-[24rem] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-slate-400">
                          Workshop Alerts
                        </p>
                        <h3 className="mt-1 text-lg font-headline font-extrabold text-slate-900">
                          Customer approvals
                        </h3>
                      </div>
                      <span className="rounded-full bg-cyan-100 px-3 py-1 text-[0.6875rem] font-black uppercase tracking-[0.18em] text-cyan-700">
                        {approvalNotifications.length}
                      </span>
                    </div>
                  </div>

                  <div className="max-h-[28rem] overflow-y-auto p-3">
                    {isNotificationsLoading ? (
                      <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                        Loading notifications...
                      </div>
                    ) : notificationErrorMessage ? (
                      <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 text-sm text-error">
                        {notificationErrorMessage}
                      </div>
                    ) : approvalNotifications.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                        No new customer approvals right now.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {approvalNotifications.map((notification) => (
                          <button
                            key={notification.serviceOrderId}
                            type="button"
                            onClick={() => {
                              void handleNotificationClick(notification)
                            }}
                            className="w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4 text-left transition-all hover:border-cyan-200 hover:bg-cyan-50/40"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {notification.customerName} approved the work
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                  {notification.vehicleDisplayName} · {notification.licensePlate}
                                </p>
                              </div>
                              <MaterialIcon name="notifications_active" className="text-xl text-cyan-600" />
                            </div>

                            <div className="mt-3 space-y-1 text-xs font-medium text-slate-500">
                              <p>
                                Approved at {notificationDateTimeFormatter.format(new Date(notification.customerApprovedAt))}
                              </p>
                              <p>
                                Estimate total {notificationCurrencyFormatter.format(notification.estimatedTotalCost)}
                              </p>
                              <p className="line-clamp-2">
                                {notification.requestedServices.length > 0
                                  ? notification.requestedServices.join(', ')
                                  : 'Repair scope ready to start.'}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
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
