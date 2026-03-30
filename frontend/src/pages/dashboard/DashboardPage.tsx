import { useState } from 'react'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'
import { BookingList } from '../../features/dashboard/components/BookingList'
import { BookingDetailsView } from '../../features/dashboard/components/BookingDetailsView'
import { mockBookings, getBookingSummary } from '../../features/dashboard/mock/dashboard-data'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'

export function DashboardPage() {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    mockBookings.length > 0 ? mockBookings[0].id : null
  )

  const selectedBooking = mockBookings.find((b) => b.id === selectedBookingId) || null
  const summary = getBookingSummary()

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-headline font-extrabold tracking-tight text-on-background">
          Service Dashboard
        </h1>
        <p className="text-on-surface-variant">
          Manage and track all your vehicle service bookings
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="shell-panel p-4">
          <div className="flex items-center gap-3 mb-2">
            <MaterialIcon name="event" className="text-primary text-2xl" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Total
            </span>
          </div>
          <p className="text-3xl font-headline font-black text-on-surface">{summary.totalBookings}</p>
        </div>

        <div className="shell-panel p-4">
          <div className="flex items-center gap-3 mb-2">
            <MaterialIcon name="build_circle" className="text-primary text-2xl" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Active
            </span>
          </div>
          <p className="text-3xl font-headline font-black text-primary">{summary.active}</p>
        </div>

        <div className="shell-panel p-4">
          <div className="flex items-center gap-3 mb-2">
            <MaterialIcon name="event_available" className="text-blue-600 text-2xl" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Upcoming
            </span>
          </div>
          <p className="text-3xl font-headline font-black text-blue-600">{summary.upcoming}</p>
        </div>

        <div className="shell-panel p-4">
          <div className="flex items-center gap-3 mb-2">
            <MaterialIcon name="check_circle" className="text-green-600 text-2xl" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Completed
            </span>
          </div>
          <p className="text-3xl font-headline font-black text-green-600">{summary.completed}</p>
        </div>
      </div>

      {/* Main Content: Bookings List + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Bookings List */}
        <div className="lg:col-span-5 xl:col-span-4">
          <h2 className="text-xl font-headline font-bold text-on-surface mb-4">
            Your Bookings
          </h2>
          <BookingList
            bookings={mockBookings}
            selectedBookingId={selectedBookingId}
            onSelectBooking={setSelectedBookingId}
          />
        </div>

        {/* Right: Selected Booking Details */}
        <div className="lg:col-span-7 xl:col-span-8">
          <h2 className="text-xl font-headline font-bold text-on-surface mb-4">
            Booking Details
          </h2>
          <BookingDetailsView
            booking={selectedBooking}
            onBack={() => setSelectedBookingId(null)}
          />
        </div>
      </div>
    </DashboardShell>
  )
}
