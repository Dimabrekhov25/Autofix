import type { ServiceCatalogItemDto } from '../../../apis/catalogApi'

export interface ServiceCatalogFormState {
  name: string
  description: string
  category: 'service' | 'diagnostic'
  basePrice: string
  estimatedDuration: string
  isActive: boolean
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatDurationLabel(duration: string) {
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

export function getCategoryLabel(category: 0 | 1) {
  return category === 0 ? 'Service' : 'Diagnostic'
}

export function getCategoryChipClassName(category: 0 | 1) {
  return category === 0
    ? 'bg-cyan-100 text-cyan-800'
    : 'bg-amber-100 text-amber-800'
}

export function createInitialFormState(): ServiceCatalogFormState {
  return {
    name: '',
    description: '',
    category: 'service',
    basePrice: '',
    estimatedDuration: '01:00:00',
    isActive: true,
  }
}

export function createFormState(item: ServiceCatalogItemDto | null): ServiceCatalogFormState {
  if (!item) {
    return createInitialFormState()
  }

  return {
    name: item.name,
    description: item.description,
    category: item.category === 0 ? 'service' : 'diagnostic',
    basePrice: item.basePrice.toString(),
    estimatedDuration: item.estimatedDuration,
    isActive: item.isActive,
  }
}

export function isValidDuration(value: string) {
  return /^\d{1,2}:\d{2}:\d{2}$/.test(value.trim())
}
