import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { APP_ROUTES, resolveBookingRoute } from '../shared/constants/routes'
import { useAuth } from '../features/auth/useAuth'
import { HomePage } from '../features/home/HomePage'
import { BookingPage } from '../features/booking/pages/BookingPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { ScrollToHash } from './ScrollToHash'

function ProtectedBookingRoute() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.register} replace />
  }

  return <BookingPage />
}

function BookingEntryRedirect() {
  const { isAuthenticated } = useAuth()

  return <Navigate to={resolveBookingRoute(isAuthenticated)} replace />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path={APP_ROUTES.home} element={<HomePage />} />
        <Route path={APP_ROUTES.register} element={<RegisterPage />} />
        <Route path={APP_ROUTES.booking} element={<ProtectedBookingRoute />} />
        <Route path={APP_ROUTES.bookingEntry} element={<BookingEntryRedirect />} />
        <Route path="*" element={<Navigate to={APP_ROUTES.home} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
