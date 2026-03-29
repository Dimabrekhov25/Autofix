import { useState } from 'react'

import {
  inventoryAlert,
  inventoryCategoryOptions,
  inventoryMetrics,
  inventoryOverview,
  inventoryParts,
} from '../../features/inventory/mock/inventory-data'
import { InventoryFilters } from '../../features/inventory/components/InventoryFilters'
import type { InventoryStatusFilter } from '../../features/inventory/components/InventoryFilters'
import { InventoryHeader } from '../../features/inventory/components/InventoryHeader'
import { InventoryLowStockAlert } from '../../features/inventory/components/InventoryLowStockAlert'
import { InventoryMetricCards } from '../../features/inventory/components/InventoryMetricCards'
import { InventoryTable } from '../../features/inventory/components/InventoryTable'
import type { InventoryCategory } from '../../features/inventory/types/inventory'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

export function InventoryPage() {
  const [searchValue, setSearchValue] = useState('')
  const [categoryValue, setCategoryValue] = useState<InventoryCategory | 'all'>('all')
  const [statusValue, setStatusValue] = useState<InventoryStatusFilter>('all')

  const normalizedSearch = searchValue.trim().toLowerCase()

  const filteredParts = inventoryParts.filter((part) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      part.name.toLowerCase().includes(normalizedSearch) ||
      part.sku.toLowerCase().includes(normalizedSearch) ||
      part.variant.toLowerCase().includes(normalizedSearch)

    const matchesCategory = categoryValue === 'all' || part.category === categoryValue
    const matchesStatus = statusValue === 'all' || part.status === statusValue

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <DashboardShell searchPlaceholder="Search components...">
      <section className="pb-4 pt-2">
        <InventoryHeader trackedParts={inventoryOverview.trackedParts} />
        <InventoryLowStockAlert alert={inventoryAlert} />
        <InventoryFilters
          categories={inventoryCategoryOptions}
          searchValue={searchValue}
          categoryValue={categoryValue}
          statusValue={statusValue}
          onSearchChange={setSearchValue}
          onCategoryChange={setCategoryValue}
          onStatusChange={setStatusValue}
        />
        <InventoryTable
          items={filteredParts}
          totalTrackedParts={inventoryOverview.trackedParts}
        />
        <InventoryMetricCards metrics={inventoryMetrics} />
      </section>
    </DashboardShell>
  )
}
