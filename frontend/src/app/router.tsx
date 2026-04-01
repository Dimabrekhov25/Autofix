import type { PropsWithChildren } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '../features/auth/useAuth'
import { isAdminUser } from '../features/auth/auth-types'
import { BookingPage } from '../pages/booking/BookingPage'
import { BookingConfirmationPage } from '../pages/booking/BookingConfirmationPage'
import { BookingSchedulePage } from '../pages/booking/BookingSchedulePage'
import { BookingSummaryPage } from '../pages/booking/BookingSummaryPage'
import { BookingVehiclePage } from '../pages/booking/BookingVehiclePage'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { HomePage } from '../pages/home/HomePage'
import { InventoryAddPartPage } from '../pages/inventory/InventoryAddPartPage'
import { InventoryPage } from '../pages/inventory/InventoryPage'
import { LoginPage } from '../pages/login/LoginPage'
import { PartsCatalogPage } from '../pages/parts-catalog/PartsCatalogPage'
import { PremiumOilChangePage } from '../pages/premium-oil-change/PremiumOilChangePage'
import { RegisterPage } from '../pages/register/RegisterPage'
import { ServicesPage } from '../pages/services/ServicesPage'
import { VehicleDiagnosticPage } from '../pages/diagnostic/VehicleDiagnosticPage'
import { APP_ROUTES, resolveProtectedEntryRoute } from '../shared/config/routes'
import { ScrollToHash } from './ScrollToHash'

function AuthRouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="rounded-[1.75rem] border border-white/70 bg-white/80 px-6 py-5 text-center shadow-card backdrop-blur-sm">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary">
          Auth
        </p>
        <p className="mt-2 text-sm text-on-surface-variant">Restoring your session...</p>
      </div>
    </div>
  )
}

interface ProtectedRouteProps extends PropsWithChildren {
  requireAdmin?: boolean
}

function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isReady, user } = useAuth()

  if (!isReady) {
    return <AuthRouteFallback />
  }

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.login} replace />
  }

  if (requireAdmin && !isAdminUser(user)) {
    return <Navigate to={APP_ROUTES.dashboard} replace />
  }

  return children
}

function GuestOnlyRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, isReady } = useAuth()

  if (!isReady) {
    return <AuthRouteFallback />
  }

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.dashboard} replace />
  }

  return children
}

function BookingEntryRedirect() {
  const { isAuthenticated, isReady } = useAuth()

  if (!isReady) {
    return <AuthRouteFallback />
  }

  return <Navigate to={resolveProtectedEntryRoute(isAuthenticated)} replace />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path={APP_ROUTES.home} element={<HomePage />} />
        <Route
          path={APP_ROUTES.login}
          element={
            <GuestOnlyRoute>
              <LoginPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path={APP_ROUTES.register}
          element={
            <GuestOnlyRoute>
              <RegisterPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path={APP_ROUTES.dashboard}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.booking}
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.bookingSchedule}
          element={
            <ProtectedRoute>
              <BookingSchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.bookingVehicle}
          element={
            <ProtectedRoute>
              <BookingVehiclePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.bookingSummary}
          element={
            <ProtectedRoute>
              <BookingSummaryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.bookingConfirmation}
          element={
            <ProtectedRoute>
              <BookingConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.inventory}
          element={
            <ProtectedRoute requireAdmin>
              <InventoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.inventoryAddPart}
          element={
            <ProtectedRoute requireAdmin>
              <InventoryAddPartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.partsCatalog}
          element={
            <ProtectedRoute requireAdmin>
              <PartsCatalogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.diagnostics}
          element={
            <ProtectedRoute requireAdmin>
              <VehicleDiagnosticPage />
            </ProtectedRoute>
          }
        />
        <Route path={APP_ROUTES.premiumOilChange} element={<PremiumOilChangePage />} />
        <Route
          path={APP_ROUTES.services}
          element={
            <ProtectedRoute>
              <ServicesPage />
            </ProtectedRoute>
          }
        />
        <Route path={APP_ROUTES.bookingEntry} element={<BookingEntryRedirect />} />
        <Route path="*" element={<Navigate to={APP_ROUTES.home} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
