import { useState } from 'react'

import { BookingPaymentModal } from '../../booking/components/BookingPaymentModal'
import { formatBookingCurrency, formatBookingDuration, formatBookingReference, formatStartingPrice, getBookingStartingPrice } from '../../booking/lib/booking-api-helpers'
import { VehicleInfoCard } from '../../diagnostic/components/VehicleInfoCard'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import type { Booking } from '../types/booking'

interface BookingDetailsViewProps {
  booking: Booking | null
  isActionLoading?: boolean
  actionErrorMessage?: string | null
  onBack?: () => void
  onApproveEstimate?: (bookingId: string) => void
  onRequestChanges?: (bookingId: string) => void
  onChoosePaymentOption?: (bookingId: string, paymentOption: 'shop' | 'now') => void
}

function getStatusLabel(status: Booking['status']) {
  switch (status) {
    case 'awaiting-approval':
      return 'Awaiting approval'
    case 'approved':
      return 'Approved'
    case 'in-progress':
      return 'In progress'
    case 'changes-requested':
      return 'Estimate revision'
    case 'completed':
      return 'Completed'
    case 'cancelled':
      return 'Cancelled'
    default:
      return 'Pending'
  }
}

function getStatusNarrative(status: Booking['status']) {
  switch (status) {
    case 'awaiting-approval':
      return 'The mechanic inspected your vehicle and sent a repair estimate. Review the work and parts below before the workshop starts.'
    case 'approved':
      return 'You approved the estimate. The workshop has the go-ahead, but the mechanic still needs to mark the vehicle as actively in repair.'
    case 'in-progress':
      return 'The mechanic started the repair. Approved parts can now be used and the vehicle is actively being worked on.'
    case 'changes-requested':
      return 'The estimate was sent back to the workshop for revision. The updated scope will appear here after the mechanic republishes it.'
    case 'completed':
      return 'The repair has been completed. Review the final approved estimate and choose how you want to pay.'
    case 'cancelled':
      return 'This request was cancelled before the repair workflow finished.'
    default:
      return 'Your booking has been created. The workshop will inspect the car on arrival and then prepare a detailed estimate.'
  }
}

export function BookingDetailsView({
  booking,
  isActionLoading = false,
  actionErrorMessage = null,
  onBack,
  onApproveEstimate,
  onRequestChanges,
  onChoosePaymentOption,
}: BookingDetailsViewProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  if (!booking) {
    return (
      <div className="shell-panel p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container">
          <MaterialIcon name="touch_app" className="text-4xl text-on-surface-variant opacity-40" />
        </div>
        <h3 className="mb-2 font-headline text-lg font-bold text-on-surface">Select a Booking</h3>
        <p className="text-sm text-on-surface-variant">
          Click on a booking card to review the request status, estimate, and next actions.
        </p>
      </div>
    )
  }

  const scheduledWindow = `${booking.scheduledDate} at ${booking.scheduledTime}`
  const vehicleDetails = [booking.vehicle.trim, booking.vehicle.engine].filter(Boolean).join(' / ')
  const estimate = booking.estimate
  const canApprove = booking.status === 'awaiting-approval'
  const canPay = booking.status === 'approved' || booking.status === 'in-progress' || booking.status === 'completed'
  const startingLaborPrice = getBookingStartingPrice(booking.pricing)
  const estimateTotal = estimate?.estimatedTotalCost ?? startingLaborPrice
  const estimatePartQuantity = estimate?.partItems.reduce((total, item) => total + item.quantity, 0) ?? 0

  return (
    <div className="space-y-8">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-primary lg:hidden"
        >
          <MaterialIcon name="arrow_back" className="text-lg" />
          <span>Back to Bookings</span>
        </button>
      ) : null}

      <div className="space-y-2">
        <span className="text-[0.6875rem] font-label font-bold uppercase tracking-[0.1em] text-primary">
          Service Request
        </span>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface">
              {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
            </h1>
            <p className="mt-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-primary">
              Request #{formatBookingReference(booking.id)}
            </p>
            <p className="font-medium text-on-surface-variant">
              {vehicleDetails || 'Vehicle details'}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            {getStatusLabel(booking.status)}
          </span>
        </div>
      </div>

      {actionErrorMessage ? (
        <div className="rounded-2xl border border-error/15 bg-error/5 px-5 py-4 text-sm text-error">
          {actionErrorMessage}
        </div>
      ) : null}

      <div
        className={[
          'rounded-[1.75rem] px-6 py-5 shadow-panel',
          booking.status === 'awaiting-approval'
            ? 'border border-blue-200 bg-blue-50'
            : booking.status === 'approved'
              ? 'border border-cyan-200 bg-cyan-50'
            : booking.status === 'changes-requested'
              ? 'border border-amber-200 bg-amber-50'
              : 'border border-white/70 bg-white/90',
        ].join(' ')}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80">
            <MaterialIcon
              name={booking.status === 'awaiting-approval' ? 'campaign' : 'assignment'}
              className="text-2xl text-primary"
            />
          </div>
          <div>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              Next step
            </p>
            <p className="mt-2 text-base font-bold text-on-surface">{getStatusLabel(booking.status)}</p>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              {getStatusNarrative(booking.status)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <VehicleInfoCard label="Scheduled" value={scheduledWindow} />
        <VehicleInfoCard label="Plate Number" value={booking.vehicle.plateNumber || 'Not provided'} />
        <VehicleInfoCard label="VIN Number" value={booking.vehicle.vin || 'Not provided'} mono />
        <VehicleInfoCard
          label="Driveability"
          value={booking.vehicle.isDrivable ? 'Vehicle can be driven in' : 'Tow support recommended'}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-headline font-bold text-on-surface">Booked Services</h2>
          <span className="text-sm font-bold text-secondary">
            {booking.services.length} selected
          </span>
        </div>

        {booking.services.length === 0 ? (
          <div className="shell-panel p-8 text-center">
            <MaterialIcon name="build_circle" className="mb-3 text-5xl text-primary opacity-40" />
            <p className="text-sm font-medium text-on-surface-variant">
              No service items were attached to this booking.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {booking.services.map((service) => (
              <div key={service.id} className="shell-panel p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-headline text-lg font-bold text-on-surface">{service.name}</h3>
                    <p className="mt-1 text-sm text-on-surface-variant">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-on-surface">
                      {formatStartingPrice(
                        service.basePrice,
                        booking.pricing.currency,
                      )}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {formatBookingDuration(service.estimatedDuration)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <div className="shell-panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                Inspection Intake
              </h3>
              <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-on-surface">
                Arrival brief
              </span>
            </div>
            <p className="text-sm leading-7 text-on-surface">
              {booking.notes?.trim()
                ? booking.notes
                : 'No customer note was attached to this booking. The workshop will rely on the selected service and the on-site inspection.'}
            </p>
          </div>

          <div className="shell-panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                Mechanic Estimate
              </h3>
              {estimate ? (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  {estimate.workItems.length} work / {estimatePartQuantity} parts
                </span>
              ) : null}
            </div>

            {!estimate ? (
              <div className="rounded-2xl bg-surface-container p-5 text-sm text-on-surface-variant">
                The mechanic has not published a repair estimate yet. After the on-site inspection, the detailed work scope and required parts will appear here.
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant">
                    Planned Work
                  </p>
                  {estimate.workItems.length === 0 ? (
                    <p className="rounded-2xl bg-surface-container p-4 text-sm text-on-surface-variant">
                      No work items in the estimate.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {estimate.workItems.map((item) => (
                        <div key={item.id} className="rounded-2xl bg-surface-container p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-bold text-on-surface">{item.description}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-on-surface-variant">
                                {item.laborHours.toFixed(2)}h · {formatBookingCurrency(item.hourlyRate, booking.pricing.currency)}/hr
                              </p>
                            </div>
                            <span className="font-bold text-on-surface">
                              {formatBookingCurrency(item.lineTotal, booking.pricing.currency)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant">
                    Parts And Materials
                  </p>
                  {estimate.partItems.length === 0 ? (
                    <p className="rounded-2xl bg-surface-container p-4 text-sm text-on-surface-variant">
                      No parts added to the estimate.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {estimate.partItems.map((item) => (
                        <div key={item.id} className="rounded-2xl bg-surface-container p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-bold text-on-surface">{item.partName}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-on-surface-variant">
                                Qty {item.quantity} · {item.availability === 1 ? 'In stock' : 'Back order'}
                              </p>
                            </div>
                            <span className="font-bold text-on-surface">
                              {formatBookingCurrency(item.lineTotal, booking.pricing.currency)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="shell-panel p-6">
            <h3 className="mb-3 font-headline text-sm font-bold uppercase tracking-wider text-on-surface-variant">
              What You Booked Online
            </h3>
            <p className="text-sm text-on-surface-variant">
              The online booking only reserved an inspection slot and the initial service request. Final parts and final repair pricing are decided after inspection.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="shell-panel p-6">
            <h3 className="mb-4 font-headline text-sm font-bold uppercase tracking-wider text-on-surface-variant">
              Estimate Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">{estimate ? 'Labor' : 'Service price'}</span>
                <span className="font-bold text-on-surface">
                  {formatBookingCurrency(
                    estimate?.estimatedLaborCost ?? startingLaborPrice,
                    booking.pricing.currency,
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">
                    Parts{estimate ? ` (${estimatePartQuantity})` : ''}
                  </span>
                  <span className="font-bold text-on-surface">
                    {formatBookingCurrency(estimate?.estimatedPartsCost ?? 0, booking.pricing.currency)}
                  </span>
              </div>
              <div className="flex items-center justify-between border-t border-outline-variant/10 pt-3">
                <span className="font-headline text-base font-bold text-on-surface">
                  {estimate ? 'Estimate total' : 'Starting labor from'}
                </span>
                <span className="font-headline text-xl font-extrabold text-on-surface">
                  {estimate
                    ? formatBookingCurrency(estimateTotal, booking.pricing.currency)
                    : formatStartingPrice(estimateTotal, booking.pricing.currency)}
                </span>
              </div>
            </div>
          </div>

          {canApprove ? (
            <div className="shell-panel p-6">
              <h3 className="mb-3 font-headline text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                Customer Approval
              </h3>
              <p className="mb-4 text-sm text-on-surface-variant">
                Review the mechanic estimate and decide whether the workshop can start the repair.
              </p>
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() => onApproveEstimate?.(booking.id)}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-on-primary disabled:opacity-60"
                >
                  {isActionLoading ? 'Saving...' : 'Approve Estimate'}
                </button>
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() => onRequestChanges?.(booking.id)}
                  className="w-full rounded-xl border border-outline-variant/20 px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-on-surface disabled:opacity-60"
                >
                  Request Changes
                </button>
              </div>
            </div>
          ) : null}

          {canPay ? (
            <div className="shell-panel p-6">
              <h3 className="mb-3 font-headline text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                Payment
              </h3>
              <p className="mb-4 text-sm text-on-surface-variant">
              Choose how you want to pay for the approved repair.
              </p>
              <div className="mb-4 rounded-2xl bg-surface-container p-4 text-sm text-on-surface">
                Current method:{' '}
                <span className="font-bold">
                  {booking.paymentOption === 1 ? 'Pay now' : 'Pay at shop'}
                </span>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-on-primary disabled:opacity-60"
                >
                  Pay Online
                </button>
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() => onChoosePaymentOption?.(booking.id, 'shop')}
                  className="w-full rounded-xl border border-outline-variant/20 px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-on-surface disabled:opacity-60"
                >
                  Pay at Shop
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <BookingPaymentModal
        open={isPaymentModalOpen}
        totalAmount={estimateTotal}
        paymentMethod="now"
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={() => {
          setIsPaymentModalOpen(false)
          onChoosePaymentOption?.(booking.id, 'now')
        }}
      />
    </div>
  )
}
