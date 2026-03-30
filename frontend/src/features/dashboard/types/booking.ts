import type { VehicleDiagnosticData } from '../../diagnostic/types/vehicle'

export type BookingStatus = 'pending' | 'confirmed' | 'in-service' | 'completed' | 'cancelled'

export interface Booking {
  id: string
  vehicleId: string
  status: BookingStatus
  scheduledDate: string
  scheduledTime: string
  estimatedCompletion?: string
  diagnosticData: VehicleDiagnosticData
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
