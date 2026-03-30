import type { Booking } from '../types/booking'
import type { DiagnosticIssue } from '../../diagnostic/types/vehicle'
import { VehicleHeader } from '../../diagnostic/components/VehicleHeader'
import { VehicleInfoCard } from '../../diagnostic/components/VehicleInfoCard'
import { IssueCard } from '../../diagnostic/components/IssueCard'
import { CostCalculator } from '../../diagnostic/components/CostCalculator'
import { ServiceHistory } from '../../diagnostic/components/ServiceHistory'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface BookingDetailsViewProps {
  booking: Booking | null
  onBack?: () => void
}

export function BookingDetailsView({ booking, onBack }: BookingDetailsViewProps) {
  if (!booking) {
    return (
      <div className="shell-panel p-12 text-center">
        <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-surface-container flex items-center justify-center">
          <MaterialIcon name="touch_app" className="text-4xl text-on-surface-variant opacity-40" />
        </div>
        <h3 className="font-headline font-bold text-lg text-on-surface mb-2">
          Select a Booking
        </h3>
        <p className="text-sm text-on-surface-variant">
          Click on a booking card to view detailed diagnostic information.
        </p>
      </div>
    )
  }

  const { vehicle, issues, costBreakdown, serviceHistory } = booking.diagnosticData
  const activeIssues = issues.filter((issue: DiagnosticIssue) => issue.priority !== 'resolved')
  const resolvedIssues = issues.filter((issue: DiagnosticIssue) => issue.priority === 'resolved')

  return (
    <div className="space-y-8">
      {/* Mobile Back Button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="lg:hidden flex items-center gap-2 text-primary font-medium text-sm"
        >
          <MaterialIcon name="arrow_back" className="text-lg" />
          <span>Back to Bookings</span>
        </button>
      )}

      {/* Vehicle Header */}
      <VehicleHeader vehicle={vehicle} />

      {/* Vehicle Info Cards */}
      <div className="grid grid-cols-2 gap-4">
        <VehicleInfoCard label="VIN Number" value={vehicle.vin} mono />
        <VehicleInfoCard
          label="Odometer"
          value={`${vehicle.odometer.toLocaleString()} ${vehicle.odometerUnit}`}
        />
      </div>

      {/* Diagnostic Issues */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-headline font-bold text-on-surface">Diagnostic Issues</h2>
          {activeIssues.length > 0 && (
            <span className="text-sm font-bold text-secondary">
              {activeIssues.length} Active
            </span>
          )}
        </div>

        {issues.length === 0 ? (
          <div className="shell-panel p-8 text-center">
            <MaterialIcon name="check_circle" className="text-5xl text-primary opacity-40 mb-3" />
            <p className="text-sm font-medium text-on-surface-variant">
              No issues detected. Vehicle in good condition.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeIssues.map((issue: DiagnosticIssue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
            {resolvedIssues.map((issue: DiagnosticIssue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>

      {/* Cost Calculator */}
      {costBreakdown.grandTotal > 0 && <CostCalculator breakdown={costBreakdown} />}

      {/* Service History */}
      {serviceHistory.length > 0 && <ServiceHistory records={serviceHistory} />}

      {/* Booking Notes */}
      {booking.notes && (
        <div className="shell-panel p-6">
          <h3 className="font-headline font-bold text-sm uppercase tracking-wider text-on-surface-variant mb-3">
            Booking Notes
          </h3>
          <p className="text-sm text-on-surface">{booking.notes}</p>
        </div>
      )}
    </div>
  )
}
