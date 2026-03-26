export interface BookingCalendarDay {
  value: number
  available?: boolean
}

export interface BookingTimeSlot {
  id: string
  label: string
  period: 'morning' | 'afternoon'
  available: boolean
}

export interface BookingSummaryCard {
  id: string
  label: string
  value: string
  icon: string
  emphasized?: boolean
  pending?: boolean
}

export interface BookingSelectionState {
  date: number
  timeSlotId: string
}
