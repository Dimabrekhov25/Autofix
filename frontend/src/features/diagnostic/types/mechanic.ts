export interface Customer {
  id: string
  name: string
  phone: string
  email: string
}

export type VehicleDiagnosticStatus =
  | 'waiting-diagnosis'
  | 'in-progress'
  | 'waiting-parts'
  | 'pending-approval'
  | 'approved'
  | 'in-repair'
  | 'completed'

export type PartAvailability = 'in-stock' | 'need-to-order'

export interface MechanicVehicle {
  id: string
  vehicle: {
    id: string
    make: string
    model: string
    year: number
    plateNumber: string
    vin: string
    odometer: number
    odometerUnit: 'mi' | 'km'
  }
  customer: Customer
  status: VehicleDiagnosticStatus
  assignedAt: string
  issues: ExtendedDiagnosticIssue[]
  laborRate: number
}

export interface ExtendedDiagnosticIssue {
  id: string
  priority: 'high' | 'medium' | 'resolved'
  title: string
  description: string
  cost: number
  laborHours: number
  parts?: Array<{
    id: string
    name: string
    availability: PartAvailability
  }>
  isOptional?: boolean
  hasPartsAssigned?: boolean
}

export interface IssueFormData {
  title: string
  description: string
  parts: Array<{
    name: string
    availability: PartAvailability
  }>
  laborHours: number
  isOptional: boolean
}
