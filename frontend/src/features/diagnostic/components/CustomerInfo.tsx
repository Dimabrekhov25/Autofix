import type { Customer } from '../types/mechanic'

interface CustomerInfoProps {
  customer: Customer
}

export function CustomerInfo({ customer }: CustomerInfoProps) {
  return (
    <div className="bg-surface-container rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-primary text-2xl">person</span>
        <h3 className="text-lg font-semibold text-on-surface">Customer Information</h3>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-sm text-on-surface-variant mb-1">Name</div>
          <div className="text-base font-medium text-on-surface">{customer.name}</div>
        </div>

        <div>
          <div className="text-sm text-on-surface-variant mb-1">Phone</div>
          <a
            href={`tel:${customer.phone}`}
            className="text-base text-primary hover:underline inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">call</span>
            {customer.phone}
          </a>
        </div>

        <div>
          <div className="text-sm text-on-surface-variant mb-1">Email</div>
          <a
            href={`mailto:${customer.email}`}
            className="text-base text-primary hover:underline inline-flex items-center gap-1 break-all"
          >
            <span className="material-symbols-outlined text-sm">email</span>
            {customer.email}
          </a>
        </div>
      </div>
    </div>
  )
}
