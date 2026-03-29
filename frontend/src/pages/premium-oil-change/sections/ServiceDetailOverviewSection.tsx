import { Button } from '../../../shared/ui/Button'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import type { PremiumOilChangeContent } from '../types/premium-oil-change'

interface ServiceDetailOverviewSectionProps {
  content: PremiumOilChangeContent
}

export function ServiceDetailOverviewSection({
  content,
}: ServiceDetailOverviewSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
      <div className="space-y-12 lg:col-span-7">
        <div className="group relative">
          <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-r from-primary/15 to-primary-container/15 blur-xl opacity-40 transition duration-700 group-hover:opacity-70" />
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.75rem] bg-surface-container-low shadow-panel">
            <img
              src={content.image.src}
              alt={content.image.alt}
              className="h-full w-full object-cover grayscale-[18%] transition duration-700 group-hover:grayscale-0"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-on-surface">
            {content.includedTitle}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {content.includedItems.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-5 shadow-panel"
              >
                <div className="flex items-start gap-3">
                  <MaterialIcon name={item.icon} className="mt-0.5 text-xl text-primary" />
                  <div>
                    <h3 className="font-semibold text-on-surface">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary-container/20 p-4">
            <MaterialIcon name="description" className="text-primary-dim" />
            <p className="font-medium text-on-primary-container">{content.serviceRecordNote}</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="sticky top-28 rounded-[1.75rem] border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-card md:p-10">
          <div className="space-y-4">
            <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-[-0.06em] text-on-surface">
              {content.title}
            </h1>
            <p className="leading-7 text-on-surface-variant">{content.description}</p>
          </div>

          <div className="mt-6 space-y-6 border-t border-surface-container pt-6">
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-on-surface-variant">
                {content.estimatedPriceLabel}
              </span>
              <span className="text-2xl font-bold text-on-surface">
                {content.estimatedPriceValue}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-on-surface-variant">{content.durationLabel}</span>
              <span className="flex items-center font-medium text-on-surface">
                <MaterialIcon name="schedule" className="mr-2 text-primary" />
                {content.durationValue}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Button to={content.ctaTo} className="w-full justify-center py-5 text-base">
              {content.ctaLabel}
            </Button>
            <p className="px-2 text-center text-xs leading-5 text-on-surface-variant">
              {content.disclaimer}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-surface-container pt-6">
            {content.trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="rounded-xl bg-surface-container-low p-3 text-center"
              >
                <MaterialIcon name={badge.icon} className="mb-2 text-primary" />
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                  {badge.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
