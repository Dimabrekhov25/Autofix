import {
  bookingDefaults,
  bookingDiagnosticOptions,
  bookingServiceOptions,
  bookingTimeSlots,
} from '../constants/booking-content'
import type { BookingOptionKind } from '../types/booking'
import {
  getFirstAvailableBookingDay,
  getCurrentBookingMonthKey,
} from './booking-date'

export interface BookingFlowState {
  kind: BookingOptionKind
  selectedServiceIds: string[]
  selectedDiagnosticId: string
  diagnosticNotes: string
  paymentMethod: 'now' | 'shop'
  selectedMonthKey: string
  selectedDate: number
  selectedSlotId: string
  scheduleVisited: boolean
  vehicleVin: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  vehicleTrim: string
}

export function resolveBookingFlowState(searchParams: URLSearchParams): BookingFlowState {
  const kind: BookingOptionKind = searchParams.get('kind') === 'diagnostic' ? 'diagnostic' : 'service'

  const requestedServiceIds = (searchParams.get('services') ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const selectedServiceIds = bookingServiceOptions
    .filter((option) => requestedServiceIds.includes(option.id))
    .map((option) => option.id)

  const selectedDiagnosticId = bookingDiagnosticOptions.some(
    (option) => option.id === searchParams.get('option')
  )
    ? (searchParams.get('option') as string)
    : bookingDiagnosticOptions[0].id

  const selectedMonthKey = searchParams.get('month') ?? getCurrentBookingMonthKey()
  const parsedDate = Number.parseInt(searchParams.get('date') ?? '', 10)
  const selectedDate = Number.isFinite(parsedDate)
    ? parsedDate
    : getFirstAvailableBookingDay(selectedMonthKey, bookingDefaults.selectedDate)

  const slotId = searchParams.get('slot')
  const selectedSlotId = bookingTimeSlots.some((slot) => slot.id === slotId)
    ? (slotId as string)
    : bookingDefaults.selectedSlotId

  return {
    kind,
    selectedServiceIds: searchParams.has('services')
      ? selectedServiceIds
      : [bookingServiceOptions[0].id],
    selectedDiagnosticId,
    diagnosticNotes: searchParams.get('notes') ?? '',
    paymentMethod: searchParams.get('payment') === 'now' ? 'now' : 'shop',
    selectedMonthKey,
    selectedDate,
    selectedSlotId,
    scheduleVisited: searchParams.get('scheduleVisited') === '1',
    vehicleVin: searchParams.get('vin') ?? '',
    vehicleMake: searchParams.get('make') ?? '',
    vehicleModel: searchParams.get('model') ?? '',
    vehicleYear: searchParams.get('year') ?? '',
    vehicleTrim: searchParams.get('trim') ?? '',
  }
}

export function createBookingSearchParams(
  state: BookingFlowState,
  options?: { includeScheduleState?: boolean }
) {
  const params = new URLSearchParams()
  const includeScheduleState = options?.includeScheduleState ?? state.scheduleVisited

  params.set('kind', state.kind)
  params.set('services', state.selectedServiceIds.join(','))
  params.set('option', state.selectedDiagnosticId)

  if (state.diagnosticNotes.trim()) {
    params.set('notes', state.diagnosticNotes.trim())
  }

  params.set('payment', state.paymentMethod)

  if (includeScheduleState) {
    params.set('scheduleVisited', '1')
    params.set('month', state.selectedMonthKey)
    params.set('date', String(state.selectedDate))
    params.set('slot', state.selectedSlotId)
  }

  if (state.vehicleVin.trim()) {
    params.set('vin', state.vehicleVin.trim())
  }

  if (state.vehicleMake.trim()) {
    params.set('make', state.vehicleMake.trim())
  }

  if (state.vehicleModel.trim()) {
    params.set('model', state.vehicleModel.trim())
  }

  if (state.vehicleYear.trim()) {
    params.set('year', state.vehicleYear.trim())
  }

  if (state.vehicleTrim.trim()) {
    params.set('trim', state.vehicleTrim.trim())
  }

  return params
}

export function hasScheduleSelection(state: BookingFlowState) {
  return state.scheduleVisited
}
