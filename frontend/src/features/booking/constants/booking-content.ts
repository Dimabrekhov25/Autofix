import type {
  BookingCalendarDay,
  BookingSummaryCard,
  BookingTimeSlot,
} from '../types/booking'

export const bookingProgressSteps = [
  { id: 'services', label: 'Services', state: 'completed' },
  { id: 'schedule', label: 'Schedule', state: 'current' },
  { id: 'vehicle', label: 'Vehicle', state: 'upcoming' },
  { id: 'summary', label: 'Summary', state: 'upcoming' },
] as const

export const bookingCalendarWeekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export const bookingCalendarLeadingEmptyDays = 4

export const bookingCalendarDays: BookingCalendarDay[] = [
  { value: 1, available: false },
  { value: 2, available: true },
  { value: 3, available: true },
  { value: 4, available: true },
  { value: 5, available: true },
  { value: 6, available: true },
  { value: 7, available: true },
  { value: 8, available: true },
  { value: 9, available: true },
  { value: 10, available: true },
  { value: 11, available: true },
  { value: 12, available: true },
  { value: 13, available: true },
  { value: 14, available: true },
  { value: 15, available: true },
  { value: 16, available: true },
  { value: 17, available: true },
] as const

export const bookingTimeSlots: BookingTimeSlot[] = [
  { id: '08-30', label: '08:30 AM', period: 'morning', available: true },
  { id: '09-15', label: '09:15 AM', period: 'morning', available: true },
  { id: '10-45', label: '10:45 AM', period: 'morning', available: true },
  { id: '13-30', label: '01:30 PM', period: 'afternoon', available: true },
  { id: '15-00', label: '03:00 PM', period: 'afternoon', available: true },
  { id: '16-45', label: '04:45 PM', period: 'afternoon', available: false },
] as const

export const bookingSummaryBase: Omit<BookingSummaryCard, 'value' | 'pending' | 'emphasized'>[] = [
  { id: 'service', label: 'Service', icon: 'oil_barrel' },
  { id: 'date-time', label: 'Date & Time', icon: 'calendar_month' },
  { id: 'vehicle', label: 'Vehicle', icon: 'directions_car' },
  { id: 'estimate', label: 'Estimate', icon: 'receipt_long' },
] as const

export const bookingDefaults = {
  monthLabel: 'September 2024',
  monthDescription: 'Select an available workshop date',
  selectedService: 'Full Synthetic Oil',
  selectedVehicle: 'Tesla Model 3',
  pendingEstimate: 'Pending info',
  selectedEstimate: '$180 diagnostic hold',
} as const
