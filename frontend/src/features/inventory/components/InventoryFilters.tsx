import type { ChangeEvent } from 'react'

import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import { SelectField } from '../../../shared/ui/SelectField'
import type { InventoryCategory, InventoryPartStatus } from '../types/inventory'

export type InventoryStatusFilter = 'all' | InventoryPartStatus

interface InventoryFiltersProps {
  categories: InventoryCategory[]
  searchValue: string
  categoryValue: InventoryCategory | 'all'
  statusValue: InventoryStatusFilter
  onSearchChange: (value: string) => void
  onCategoryChange: (value: InventoryCategory | 'all') => void
  onStatusChange: (value: InventoryStatusFilter) => void
}

function handleSelectValue<T extends string>(
  event: ChangeEvent<HTMLSelectElement>,
  callback: (value: T) => void,
) {
  callback(event.target.value as T)
}

export function InventoryFilters({
  categories,
  searchValue,
  categoryValue,
  statusValue,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: InventoryFiltersProps) {
  return (
    <section className="mb-8 grid gap-4 lg:grid-cols-4">
      <label className="relative lg:col-span-2">
        <span className="sr-only">Search parts</span>
        <MaterialIcon
          name="filter_list"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by Part Name or SKU..."
          className="w-full rounded-xl border border-transparent bg-surface-container-low py-3.5 pl-12 pr-4 text-sm font-medium text-on-surface outline-none transition focus:border-primary/20 focus:bg-white focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <label className="sr-only" htmlFor="inventory-category-filter">
        Filter by category
      </label>
      <SelectField
        id="inventory-category-filter"
        value={categoryValue}
        onChange={(event) =>
          handleSelectValue<InventoryCategory | 'all'>(event, onCategoryChange)
        }
        className="font-medium"
      >
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </SelectField>

      <label className="sr-only" htmlFor="inventory-status-filter">
        Filter by stock status
      </label>
      <SelectField
        id="inventory-status-filter"
        value={statusValue}
        onChange={(event) =>
          handleSelectValue<InventoryStatusFilter>(event, onStatusChange)
        }
        className="font-medium"
      >
        <option value="all">Stock Status</option>
        <option value="in-stock">In Stock</option>
        <option value="low-stock">Low Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </SelectField>
    </section>
  )
}
