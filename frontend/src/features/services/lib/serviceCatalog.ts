import type {
  CatalogPartDto,
  ServiceCatalogItemDto,
  ServiceCatalogRequiredPartInputDto,
} from '../../../apis/catalogApi'
import type { InventoryItemDto } from '../../../apis/inventoryApi'

export interface RequiredPartFormItem {
  id: string
  partId: string
  quantity: string
}

export interface ServiceCatalogFormState {
  name: string
  description: string
  category: 'service' | 'diagnostic'
  basePrice: string
  estimatedLaborCost: string
  estimatedDuration: string
  isActive: boolean
  requiredParts: RequiredPartFormItem[]
}

export interface InventoryPartOption {
  inventoryItemId: string
  partId: string
  partName: string
  unitPrice: number
  quantityOnHand: number
  reservedQuantity: number
  availableQuantity: number
  minLevel: number
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
    estimatedLaborCost: '',
    estimatedDuration: '01:00:00',
    isActive: true,
    requiredParts: [],
  }
}

export function createRequiredPartFormItem(
  partId = '',
  quantity = '1',
): RequiredPartFormItem {
  return {
    id: crypto.randomUUID(),
    partId,
    quantity,
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
    estimatedLaborCost: item.estimatedLaborCost.toString(),
    estimatedDuration: item.estimatedDuration,
    isActive: item.isActive,
    requiredParts: item.requiredParts.map((requiredPart) =>
      createRequiredPartFormItem(requiredPart.partId, requiredPart.quantity.toString()),
    ),
  }
}

export function normalizeRequiredParts(
  items: RequiredPartFormItem[],
): ServiceCatalogRequiredPartInputDto[] {
  const grouped = new Map<string, number>()

  items.forEach((item) => {
    const normalizedPartId = item.partId.trim()
    const quantity = Number.parseInt(item.quantity, 10)

    if (!normalizedPartId || !Number.isFinite(quantity) || quantity <= 0) {
      return
    }

    grouped.set(normalizedPartId, (grouped.get(normalizedPartId) ?? 0) + quantity)
  })

  return Array.from(grouped.entries()).map(([partId, quantity]) => ({
    partId,
    quantity,
  }))
}

export function isValidDuration(value: string) {
  return /^\d{1,2}:\d{2}:\d{2}$/.test(value.trim())
}

export function buildRequiredPartsSummary(
  item: ServiceCatalogItemDto,
  partsById: Map<string, CatalogPartDto>,
) {
  if (item.requiredParts.length === 0) {
    return 'No reserved parts'
  }

  return item.requiredParts
    .map((requiredPart) => {
      const part = partsById.get(requiredPart.partId)
      const name = part?.name ?? requiredPart.partName
      return `${name} x${requiredPart.quantity}`
    })
    .join(', ')
}

export function buildInventoryPartOptions(
  parts: CatalogPartDto[],
  inventoryItems: InventoryItemDto[],
): InventoryPartOption[] {
  const partsById = new Map(parts.map((part) => [part.id, part]))

  return inventoryItems
    .map((inventoryItem) => {
      const part = partsById.get(inventoryItem.partId)
      if (!part) {
        return null
      }

      return {
        inventoryItemId: inventoryItem.id,
        partId: inventoryItem.partId,
        partName: part.name,
        unitPrice: part.unitPrice,
        quantityOnHand: inventoryItem.quantityOnHand,
        reservedQuantity: inventoryItem.reservedQuantity,
        availableQuantity: inventoryItem.quantityOnHand - inventoryItem.reservedQuantity,
        minLevel: inventoryItem.minLevel,
      } satisfies InventoryPartOption
    })
    .filter((item): item is InventoryPartOption => item !== null)
    .sort((left, right) => left.partName.localeCompare(right.partName))
}
