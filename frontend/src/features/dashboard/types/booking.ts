export type BookingStatus = 'pending' | 'confirmed' | 'in-service' | 'completed' | 'cancelled'

export interface BookingVehicle {
  id: string
  make: string
  model: string
  year: number
  trim: string
  engine: string
  plateNumber: string
  vin: string
  isDrivable: boolean
}

export interface BookingService {
  id: string
  name: string
  description: string
  estimatedDuration: string
  basePrice: number
  estimatedLaborCost: number
}

export interface BookingPricing {
  subtotal: number
  estimatedLaborCost: number
  taxAmount: number
  totalEstimate: number
  currency: string
}

export interface Booking {
  id: string
  customerId: string
  vehicleId: string
  vehicle: BookingVehicle
  status: BookingStatus
  scheduledAt: string
  scheduledDate: string
  scheduledTime: string
  endAt: string
  estimatedCompletion?: string
  pricing: BookingPricing
  paymentOption: number
  services: BookingService[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface BookingSummary {
  totalBookings: number
  active: number
  completed: number
  upcoming: number
}
