import { useState } from 'react'
import type { IssueFormData, PartAvailability } from '../types/mechanic'

interface AddIssueModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (issue: IssueFormData) => void
  laborRate: number
}

interface PartInput {
  id: string
  name: string
  availability: PartAvailability
}

export function AddIssueModal({ isOpen, onClose, onSave, laborRate }: AddIssueModalProps) {
  const [formData, setFormData] = useState<IssueFormData>({
    title: '',
    description: '',
    parts: [],
    laborHours: 1,
    isOptional: false,
  })

  const [parts, setParts] = useState<PartInput[]>(() => [
    { id: crypto.randomUUID(), name: '', availability: 'in-stock' },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    if (!formData.title.trim()) {
      alert('Please enter issue title')
      return
    }

    if (!formData.description.trim()) {
      alert('Please enter issue description')
      return
    }

    // Filter out empty parts
    const validParts = parts.filter((p) => p.name.trim())

    onSave({
      ...formData,
      parts: validParts.map((p) => ({ name: p.name, availability: p.availability })),
    })

    // Reset form
    setFormData({
      title: '',
      description: '',
      parts: [],
      laborHours: 1,
      isOptional: false,
    })
    setParts([{ id: crypto.randomUUID(), name: '', availability: 'in-stock' }])
    onClose()
  }

  const handleAddPart = () => {
    setParts([...parts, { id: crypto.randomUUID(), name: '', availability: 'in-stock' }])
  }

  const handleRemovePart = (id: string) => {
    if (parts.length > 1) {
      setParts(parts.filter((p) => p.id !== id))
    }
  }

  const handlePartChange = (id: string, field: 'name' | 'availability', value: string) => {
    setParts(parts.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slideUp pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-outline-variant flex-shrink-0 bg-surface-container-lowest rounded-t-2xl">
            <h2 className="text-2xl font-bold text-on-surface">Add New Issue</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-container rounded-full transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-on-surface">close</span>
            </button>
          </div>

          {/* Scrollable Form Container */}
          <div className="overflow-y-auto flex-1">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="issue-title" className="block text-sm font-medium text-on-surface mb-2">
                Issue Title <span className="text-error">*</span>
              </label>
              <input
                id="issue-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Front Brake Pad Wear"
                className="w-full px-4 py-3 bg-surface-container rounded-xl text-on-surface placeholder:text-on-surface-variant border-2 border-transparent focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="issue-description" className="block text-sm font-medium text-on-surface mb-2">
                Description <span className="text-error">*</span>
              </label>
              <textarea
                id="issue-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the issue in detail..."
                rows={4}
                className="w-full px-4 py-3 bg-surface-container rounded-xl text-on-surface placeholder:text-on-surface-variant border-2 border-transparent focus:border-primary focus:outline-none transition-colors resize-none"
                required
              />
            </div>

            {/* Parts */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-3">Required Parts</label>
              <div className="space-y-3">
                {parts.map((part) => (
                  <div key={part.id} className="flex gap-3">
                    <input
                      type="text"
                      value={part.name}
                      onChange={(e) => handlePartChange(part.id, 'name', e.target.value)}
                      placeholder="Part name"
                      className="flex-1 px-4 py-3 bg-surface-container rounded-xl text-on-surface placeholder:text-on-surface-variant border-2 border-transparent focus:border-primary focus:outline-none transition-colors"
                    />
                    <select
                      value={part.availability}
                      onChange={(e) => handlePartChange(part.id, 'availability', e.target.value as PartAvailability)}
                      className="px-4 py-3 bg-surface-container rounded-xl text-on-surface border-2 border-transparent focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="in-stock">In Stock</option>
                      <option value="need-to-order">Need to Order</option>
                    </select>
                    {parts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePart(part.id)}
                        className="p-3 hover:bg-error-container rounded-xl transition-colors"
                        aria-label="Remove part"
                      >
                        <span className="material-symbols-outlined text-error">delete</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddPart}
                className="mt-3 flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary-fixed rounded-xl transition-colors text-sm font-medium"
              >
                <span className="material-symbols-outlined">add</span>
                Add Part
              </button>
            </div>

            {/* Labor Hours */}
            <div>
              <label htmlFor="labor-hours" className="block text-sm font-medium text-on-surface mb-2">
                Labor Hours <span className="text-error">*</span>
              </label>
              <input
                id="labor-hours"
                type="number"
                value={formData.laborHours}
                onChange={(e) => setFormData({ ...formData, laborHours: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.25"
                className="w-full px-4 py-3 bg-surface-container rounded-xl text-on-surface border-2 border-transparent focus:border-primary focus:outline-none transition-colors"
                required
              />
              <p className="mt-2 text-sm text-on-surface-variant">
                Labor cost: ${(formData.laborHours * laborRate).toFixed(2)} (${laborRate}/hr)
              </p>
            </div>

            {/* Optional Checkbox */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isOptional}
                  onChange={(e) => setFormData({ ...formData, isOptional: e.target.checked })}
                  className="w-5 h-5 rounded border-2 border-outline text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-on-surface">
                  This is an optional repair (customer can decline)
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-surface-container hover:bg-surface-container-high rounded-xl text-on-surface font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dim rounded-xl text-on-primary font-medium transition-colors"
              >
                Save Issue
              </button>
            </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
