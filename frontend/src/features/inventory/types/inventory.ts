export type InventoryCategory =
  | 'Brakes'
  | 'Engine'
  | 'Transmission'
  | 'Fluids'
  | 'Electrical'

export type InventoryPartStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export type InventoryMetricTone = 'neutral' | 'primary' | 'accent'

export interface InventoryPart {
  id: string
  name: string
  variant: string
  sku: string
  category: InventoryCategory
  status: InventoryPartStatus
  quantity: number
  targetQuantity: number
  unitPrice: number
  compatibility: string[]
  supplier: string
  leadTime: string
  icon: string
  reorderAvailable: boolean
}

export interface InventoryAlert {
  title: string
  description: string
  actionLabel: string
}

export interface InventoryMetric {
  id: string
  label: string
  value: string
  supportingText: string
  icon: string
  tone: InventoryMetricTone
}

export interface InventoryOverview {
  trackedParts: number
  lowStockCount: number
  impactedWorkOrders: number
}
