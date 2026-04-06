import type {
  BookingPricingDto,
  BookingQuoteServiceDto,
  BookingQuoteVehicleDto,
  ServiceCatalogItemDto,
  VehicleDto,
} from '../../../apis/bookingApi'
import type { BookingFlowState } from './booking-flow'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function getSelectedCatalogItemIds(state: BookingFlowState) {
  if (state.kind === 'diagnostic') {
    return state.selectedDiagnosticId ? [state.selectedDiagnosticId] : []
  }

  return state.selectedServiceIds
}

export function formatBookingCurrency(value: number, currency = 'USD') {
  if (currency === 'USD') {
    return currencyFormatter.format(value)
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatStartingPrice(value: number, currency = 'USD') {
  return `From ${formatBookingCurrency(value, currency)}`
}

export function formatBookingReference(bookingId?: string | null) {
  if (!bookingId) {
    return 'AF-PENDING'
  }

  return `AF-${bookingId.replace(/-/g, '').slice(0, 8).toUpperCase()}`
}

export function formatBookingDuration(duration: string) {
  const [hoursPart = '0', minutesPart = '0'] = duration.split(':')
  const hours = Number.parseInt(hoursPart, 10) || 0
  const minutes = Number.parseInt(minutesPart, 10) || 0

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`
  }

  if (hours > 0) {
    return `${hours}h`
  }

  return `${minutes}m`
}

export function formatIsoSlotLabel(startAt: string) {
  if (!startAt) {
    return ''
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(startAt))
}

export function formatIsoDateLabel(startAt: string) {
  if (!startAt) {
    return ''
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(startAt))
}

export function resolveBookingOptionIcon(name: string, category: 0 | 1) {
  const normalizedName = name.toLowerCase()

  if (normalizedName.includes('oil')) return 'oil_barrel'
  if (normalizedName.includes('tire') || normalizedName.includes('wheel')) return 'tire_repair'
  if (normalizedName.includes('brake')) return 'eject'
  if (normalizedName.includes('battery')) return 'battery_charging_full'
  if (normalizedName.includes('inspect')) return 'fact_check'
  if (category === 1) return 'monitor_heart'
  return 'build'
}

export function buildVehicleLabel(
  vehicle:
    | Pick<VehicleDto, 'year' | 'make' | 'model'>
    | Pick<BookingQuoteVehicleDto, 'year' | 'make' | 'model'>
    | null
    | undefined,
) {
  if (!vehicle) {
    return undefined
  }

  return `${vehicle.year > 0 ? `${vehicle.year} ` : ''}${vehicle.make} ${vehicle.model}`.trim()
}

export function buildVehicleDetailsLabel(
  vehicle:
    | Pick<VehicleDto, 'trim' | 'engine'>
    | Pick<BookingQuoteVehicleDto, 'trim' | 'engine'>
    | null
    | undefined,
) {
  if (!vehicle) {
    return undefined
  }

  return [vehicle.trim, vehicle.engine].filter(Boolean).join(' / ')
}

export function mapServiceTotal(item: Pick<ServiceCatalogItemDto, 'basePrice'> | Pick<BookingQuoteServiceDto, 'basePrice'>) {
  return item.basePrice
}

export function getBookingStartingPrice(
  pricing: Pick<BookingPricingDto, 'subtotal'>,
) {
  return pricing.subtotal
}
