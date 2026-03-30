import { useState } from 'react'
import type { VehicleDiagnosticStatus } from '../types/mechanic'

interface VehicleSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: VehicleDiagnosticStatus | 'all'
  onStatusFilterChange: (status: VehicleDiagnosticStatus | 'all') => void
}

const statusOptions: Array<{ value: VehicleDiagnosticStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All Vehicles' },
  { value: 'waiting-diagnosis', label: 'Waiting Diagnosis' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'waiting-parts', label: 'Waiting Parts' },
  { value: 'pending-approval', label: 'Pending Approval' },
  { value: 'approved', label: 'Approved' },
  { value: 'in-repair', label: 'In Repair' },
  { value: 'completed', label: 'Completed' },
]

export function VehicleSearch({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: VehicleSearchProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const currentStatusLabel = statusOptions.find((s) => s.value === statusFilter)?.label || 'All Vehicles'

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search Input */}
      <div className="flex-1 relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by vehicle, customer, or plate..."
          className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-xl text-on-surface placeholder:text-on-surface-variant border-2 border-transparent focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Status Filter Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between gap-3 px-4 py-3 bg-surface-container rounded-xl text-on-surface hover:bg-surface-container-high transition-colors min-w-[200px]"
        >
          <span className="text-sm font-medium">{currentStatusLabel}</span>
          <span className="material-symbols-outlined text-on-surface-variant">
            {isDropdownOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-full min-w-[220px] bg-surface-container-lowest rounded-xl shadow-lg z-20 py-2 max-h-[400px] overflow-y-auto">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onStatusFilterChange(option.value)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-surface-container transition-colors ${
                    statusFilter === option.value
                      ? 'bg-primary-fixed text-primary font-medium'
                      : 'text-on-surface'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
