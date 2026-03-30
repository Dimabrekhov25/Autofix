import type { PropsWithChildren } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '../features/auth/useAuth'
import { BookingPage } from '../pages/booking/BookingPage'
import { BookingSchedulePage } from '../pages/booking/BookingSchedulePage'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { HomePage } from '../pages/home/HomePage'
import { InventoryPage } from '../pages/inventory/InventoryPage'
import { LoginPage } from '../pages/login/LoginPage'
import { PremiumOilChangePage } from '../pages/premium-oil-change/PremiumOilChangePage'
import { RegisterPage } from '../pages/register/RegisterPage'
import { ServicesPage } from '../pages/services/ServicesPage'
import { VehicleDiagnosticPage } from '../pages/diagnostic/VehicleDiagnosticPage'
import { APP_ROUTES, resolveProtectedEntryRoute } from '../shared/config/routes'
import { ScrollToHash } from './ScrollToHash'

function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.login} replace />
  }

  return children
}

function GuestOnlyRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.dashboard} replace />
  }

  return children
}

function BookingEntryRedirect() {
  const { isAuthenticated } = useAuth()

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
          path={APP_ROUTES.inventory}
          element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.diagnostics}
          element={
            <ProtectedRoute>
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
