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

export type BookingOptionKind = 'service' | 'diagnostic'

export type BookingProgressStepId = 'services' | 'schedule' | 'vehicle' | 'summary'

export interface BookingOption {
  id: string
  kind: BookingOptionKind
  title: string
  description: string
  priceLabel: string
  icon: string
  duration: string
  summaryLabel?: string
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
