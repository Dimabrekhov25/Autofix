import { useState } from 'react'

import { BookingCalendarPanel } from '../../features/booking/components/BookingCalendarPanel'
import { BookingMobileStepNav } from '../../features/booking/components/BookingMobileStepNav'
import { BookingProgressHeader } from '../../features/booking/components/BookingProgressHeader'
import { BookingSelectionSummary } from '../../features/booking/components/BookingSelectionSummary'
import { BookingTimeSlotsPanel } from '../../features/booking/components/BookingTimeSlotsPanel'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

export function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(10)
  const [selectedSlotId, setSelectedSlotId] = useState('09-15')

  return (
    <DashboardShell searchPlaceholder="Search appointments or VIN...">
      <div className="mx-auto max-w-5xl pb-24 pt-12">
        <BookingProgressHeader />

        <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_20px_40px_rgba(45,47,49,0.06)]">
          <div className="grid min-h-[600px] grid-cols-1 md:grid-cols-12">
            <BookingCalendarPanel
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <BookingTimeSlotsPanel
              selectedSlotId={selectedSlotId}
              onSelectSlot={setSelectedSlotId}
            />
          </div>
        </div>

        <BookingSelectionSummary
          selectedDate={selectedDate}
          selectedSlotId={selectedSlotId}
        />
      </div>

      <BookingMobileStepNav />
    </DashboardShell>
  )
}
