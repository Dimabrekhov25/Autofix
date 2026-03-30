export type IssuePriority = 'high' | 'medium' | 'resolved'

export type ServiceCategory = 'maintenance' | 'routine' | 'repair'

export interface VehicleInfo {
  id: string
  make: string
  model: string
  year: number
  trim: string
  color: string
  plateNumber: string
  vin: string
  odometer: number
  odometerUnit: 'mi' | 'km'
  batteryHealth?: number
  imageUrl?: string
}

export interface ServiceRecord {
  id: string
  date: string
  category: ServiceCategory
  title: string
  description: string
}

export interface IssuePart {
  id: string
  name: string
  inStock: boolean
}

export interface DiagnosticIssue {
  id: string
  priority: IssuePriority
  title: string
  description: string
  cost: number
  parts?: IssuePart[]
  laborHours?: number
  hasPartsAssigned?: boolean
}

export interface CostBreakdown {
  partsTotal: number
  laborRate: number
  laborHours: number
  diagnosticFee: number
  grandTotal: number
}

export interface VehicleDiagnosticData {
  vehicle: VehicleInfo
  serviceHistory: ServiceRecord[]
  issues: DiagnosticIssue[]
  costBreakdown: CostBreakdown
}
