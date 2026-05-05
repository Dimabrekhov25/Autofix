export type BookingStatus =
  | 'pending'
  | 'awaiting-approval'
  | 'approved'
  | 'in-progress'
  | 'changes-requested'
  | 'completed'
  | 'cancelled'

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
  discountAmount: number
  totalBeforeDiscount: number
  totalEstimate: number
  currency: string
  loyaltyDiscountRate: number
  hasLoyaltyDiscount: boolean
}

export interface BookingEstimateWorkItem {
  id: string
  description: string
  laborHours: number
  hourlyRate: number
  lineTotal: number
}

export interface BookingEstimatePartItem {
  id: string
  partId: string
  partName: string
  quantity: number
  unitPrice: number
  availability: number
  lineTotal: number
}

export interface BookingEstimate {
  serviceOrderId: string
  status: number
  estimatedLaborCost: number
  estimatedPartsCost: number
  estimatedTotalCost: number
  discountAmount: number
  payableTotal: number
  loyaltyDiscountRate: number
  hasLoyaltyDiscount: boolean
  workItems: BookingEstimateWorkItem[]
  partItems: BookingEstimatePartItem[]
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
  estimate?: BookingEstimate
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
