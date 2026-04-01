import { Link } from 'react-router-dom'

import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import { SectionHeading } from '../../../shared/ui/SectionHeading'
import type { RelatedServiceCard } from '../types/premium-oil-change'

interface ComplementaryServicesSectionProps {
  title: string
  items: RelatedServiceCard[]
}

export function ComplementaryServicesSection({
  title,
  items,
}: ComplementaryServicesSectionProps) {
  return (
    <section className="mt-24">
      <SectionHeading title={title} className="mb-10" />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="group rounded-[1.75rem] bg-surface-container-low p-6 transition-colors hover:bg-surface-container"
          >
            <MaterialIcon name={item.icon} className="mb-4 block text-3xl text-primary" />
            <h3 className="font-heading text-xl font-bold text-on-surface">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">{item.description}</p>
            <Link
              to={item.to}
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2"
            >
              Learn More
              <MaterialIcon name="arrow_forward" className="text-base" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
