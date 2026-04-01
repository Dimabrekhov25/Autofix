import type {
  BookingOption,
  BookingOptionKind,
  BookingProgressStepId,
  BookingSummaryCard,
  BookingTimeSlot,
} from '../types/booking'

export const bookingStepDefinitions = [
  { id: 'services', label: 'Services' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'vehicle', label: 'Vehicle' },
  { id: 'summary', label: 'Summary' },
] as const

export function getBookingProgressSteps(currentStep: BookingProgressStepId) {
  return getBookingProgressStepsWithCompletion(currentStep)
}

export function getBookingProgressStepsWithCompletion(
  currentStep: BookingProgressStepId,
  completedSteps: BookingProgressStepId[] = []
) {
  const currentIndex = bookingStepDefinitions.findIndex((step) => step.id === currentStep)

  return bookingStepDefinitions.map((step, index) => ({
    ...step,
    state:
      step.id === currentStep
        ? 'current'
        : completedSteps.includes(step.id) || index < currentIndex
          ? 'completed'
          : 'upcoming',
  }))
}

export const bookingCalendarWeekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export const bookingTimeSlots: BookingTimeSlot[] = [
  { id: '08-30', label: '08:30 AM', period: 'morning', available: true },
  { id: '09-15', label: '09:15 AM', period: 'morning', available: true },
  { id: '10-45', label: '10:45 AM', period: 'morning', available: true },
  { id: '13-30', label: '01:30 PM', period: 'afternoon', available: true },
  { id: '15-00', label: '03:00 PM', period: 'afternoon', available: true },
  { id: '16-45', label: '04:45 PM', period: 'afternoon', available: false },
] as const

export const bookingServiceOptions: BookingOption[] = [
  {
    id: 'oil-change',
    kind: 'service',
    title: 'Oil Change',
    description: 'Synthetic oil replacement including premium filter and inspection.',
    priceLabel: '$89.00',
    icon: 'oil_barrel',
    duration: '1h 15m',
    summaryLabel: 'Synthetic Premium',
  },
  {
    id: 'tire-replacement',
    kind: 'service',
    title: 'Tire Replacement',
    description: 'Installation of 4 new tires with precision balancing.',
    priceLabel: '$120.00',
    icon: 'tire_repair',
    duration: '2h 00m',
  },
  {
    id: 'brake-service',
    kind: 'service',
    title: 'Brake Service',
    description: 'Full pad replacement and rotor resurfacing for optimal safety.',
    priceLabel: '$245.00',
    icon: 'eject',
    duration: '2h 30m',
  },
  {
    id: 'battery-replacement',
    kind: 'service',
    title: 'Battery Replacement',
    description: 'Premium AGM battery installation with testing.',
    priceLabel: '$185.00',
    icon: 'battery_charging_full',
    duration: '1h 00m',
  },
  {
    id: 'wheel-alignment',
    kind: 'service',
    title: 'Wheel Alignment',
    description: 'Laser-guided four-wheel geometry correction.',
    priceLabel: '$95.00',
    icon: 'settings_input_component',
    duration: '1h 30m',
  },
  {
    id: 'inspection',
    kind: 'service',
    title: 'Inspection',
    description: 'Comprehensive 150-point vehicle safety check.',
    priceLabel: '$50.00',
    icon: 'fact_check',
    duration: '45m',
  },
] as const

export const bookingDiagnosticOptions: BookingOption[] = [
  {
    id: 'full-vehicle-diagnostic',
    kind: 'diagnostic',
    title: 'Full Vehicle Diagnostic',
    description: 'Complete scan across engine, electronics, and vehicle health systems.',
    priceLabel: '$180.00',
    icon: 'monitor_heart',
    duration: '1h 30m',
    summaryLabel: 'Complete system scan',
  },
  {
    id: 'engine-diagnostic',
    kind: 'diagnostic',
    title: 'Engine Diagnostic',
    description: 'Fault code analysis and live data review for engine concerns.',
    priceLabel: '$120.00',
    icon: 'earth_engine',
    duration: '1h 00m',
  },
  {
    id: 'transmission-diagnostic',
    kind: 'diagnostic',
    title: 'Transmission Diagnostic',
    description: 'Shift quality evaluation with gearbox error and sensor checks.',
    priceLabel: '$135.00',
    icon: 'settings_input_component',
    duration: '1h 15m',
  },
  {
    id: 'brake-diagnostic',
    kind: 'diagnostic',
    title: 'Brake Diagnostic',
    description: 'Targeted diagnosis for noise, vibration, and braking inconsistencies.',
    priceLabel: '$95.00',
    icon: 'eject',
    duration: '45m',
  },
] as const

export const bookingOptionGroups: Record<BookingOptionKind, readonly BookingOption[]> = {
  service: bookingServiceOptions,
  diagnostic: bookingDiagnosticOptions,
} as const

export function parseBookingPrice(priceLabel: string) {
  return Number.parseFloat(priceLabel.replace(/[^0-9.]/g, '')) || 0
}

export function resolveBookingSelection(
  kindParam?: string | null,
  optionId?: string | null,
  serviceIdsParam?: string | null
) {
  const kind: BookingOptionKind = kindParam === 'diagnostic' ? 'diagnostic' : 'service'
  const options = bookingOptionGroups[kind]

  if (kind === 'service') {
    const requestedIds = (serviceIdsParam ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    const selectedOptions = options.filter((item) => requestedIds.includes(item.id))
    const normalizedOptions = selectedOptions.length > 0 ? selectedOptions : [options[0]]

    return {
      kind,
      options,
      option: normalizedOptions[0],
      selectedOptions: normalizedOptions,
    }
  }

  const option = options.find((item) => item.id === optionId) ?? options[0]

  return {
    kind,
    options,
    option,
    selectedOptions: [option],
  }
}

export const bookingSummaryBase: Omit<BookingSummaryCard, 'value' | 'pending' | 'emphasized'>[] = [
  { id: 'service', label: 'Service', icon: 'oil_barrel' },
  { id: 'date-time', label: 'Date & Time', icon: 'calendar_month' },
  { id: 'vehicle', label: 'Vehicle', icon: 'directions_car' },
  { id: 'estimate', label: 'Estimate', icon: 'receipt_long' },
] as const

export const bookingDefaults = {
  monthDescription: 'Select an available workshop date',
  selectedService: bookingServiceOptions[0].title,
  selectedDate: 10,
  selectedSlotId: '09-15',
  selectedVehicle: 'Tesla Model 3',
  pendingEstimate: 'Pending info',
  selectedEstimate: '$180 diagnostic hold',
} as const
