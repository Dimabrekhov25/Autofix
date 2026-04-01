import type { BookingOptionKind } from '../types/booking'
import {
  clampBookingDay,
  getCurrentBookingMonthKey,
  getFirstAvailableBookingDay,
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
  selectedSlotStartAt: string
  scheduleVisited: boolean
  selectedVehicleId: string
  bookingId: string
  bookingNotes: string
  vehicleVin: string
  vehicleLicensePlate: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  vehicleTrim: string
  vehicleEngine: string
}

export function resolveBookingFlowState(searchParams: URLSearchParams): BookingFlowState {
  const kind: BookingOptionKind = searchParams.get('kind') === 'diagnostic' ? 'diagnostic' : 'service'

  const selectedServiceIds = (searchParams.get('services') ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  const selectedDiagnosticId = searchParams.get('option')?.trim() ?? ''

  const selectedMonthKey = searchParams.get('month') ?? getCurrentBookingMonthKey()
  const parsedDate = Number.parseInt(searchParams.get('date') ?? '', 10)
  const selectedDate = Number.isFinite(parsedDate)
    ? clampBookingDay(selectedMonthKey, parsedDate)
    : getFirstAvailableBookingDay(selectedMonthKey)
  const rawSlotValue = searchParams.get('slot') ?? ''
  const parsedSlotDate = new Date(rawSlotValue)
  const slotParamContainsStartAt = rawSlotValue
    ? !Number.isNaN(parsedSlotDate.getTime())
    : false

  return {
    kind,
    selectedServiceIds,
    selectedDiagnosticId,
    diagnosticNotes: searchParams.get('notes') ?? '',
    paymentMethod: searchParams.get('payment') === 'now' ? 'now' : 'shop',
    selectedMonthKey,
    selectedDate,
    selectedSlotId: slotParamContainsStartAt ? '' : rawSlotValue,
    selectedSlotStartAt: searchParams.get('slotStartAt') ?? (slotParamContainsStartAt ? rawSlotValue : ''),
    scheduleVisited: searchParams.get('scheduleVisited') === '1',
    selectedVehicleId: searchParams.get('vehicleId') ?? '',
    bookingId: searchParams.get('bookingId') ?? '',
    bookingNotes: searchParams.get('bookingNotes') ?? '',
    vehicleVin: searchParams.get('vin') ?? '',
    vehicleLicensePlate: searchParams.get('plate') ?? '',
    vehicleMake: searchParams.get('make') ?? '',
    vehicleModel: searchParams.get('model') ?? '',
    vehicleYear: searchParams.get('year') ?? '',
    vehicleTrim: searchParams.get('trim') ?? '',
    vehicleEngine: searchParams.get('engine') ?? '',
  }
}

export function createBookingSearchParams(
  state: BookingFlowState,
  options?: { includeScheduleState?: boolean }
) {
  const params = new URLSearchParams()
  const includeScheduleState = options?.includeScheduleState ?? state.scheduleVisited

  params.set('kind', state.kind)
  if (state.selectedServiceIds.length > 0) {
    params.set('services', state.selectedServiceIds.join(','))
  }
  if (state.selectedDiagnosticId) {
    params.set('option', state.selectedDiagnosticId)
  }

  if (state.diagnosticNotes.trim()) {
    params.set('notes', state.diagnosticNotes.trim())
  }

  params.set('payment', state.paymentMethod)

  if (includeScheduleState) {
    params.set('scheduleVisited', '1')
    params.set('month', state.selectedMonthKey)
    params.set('date', String(state.selectedDate))
    if (state.selectedSlotId) {
      params.set('slot', state.selectedSlotId)
    }
    if (state.selectedSlotStartAt) {
      params.set('slotStartAt', state.selectedSlotStartAt)
    }
  }

  if (state.selectedVehicleId) {
    params.set('vehicleId', state.selectedVehicleId)
  }

  if (state.bookingId) {
    params.set('bookingId', state.bookingId)
  }

  if (state.bookingNotes.trim()) {
    params.set('bookingNotes', state.bookingNotes.trim())
  }

  if (state.vehicleVin.trim()) {
    params.set('vin', state.vehicleVin.trim())
  }

  if (state.vehicleLicensePlate.trim()) {
    params.set('plate', state.vehicleLicensePlate.trim())
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

  if (state.vehicleEngine.trim()) {
    params.set('engine', state.vehicleEngine.trim())
  }

  return params
}

export function hasScheduleSelection(state: BookingFlowState) {
  return state.scheduleVisited
}
