import type { HomePageContent } from '../../../shared/types/content'
import { Container } from '../../../shared/ui/Container'
import { Icon } from '../../../shared/ui/Icon'

interface TrustBarProps {
  content: HomePageContent['trustBar']
}

export function TrustBar({ content }: TrustBarProps) {
  return (
    <section className="relative z-20 bg-surface-muted py-8">
      <Container>
        <div className="surface-card flex flex-wrap items-center justify-between gap-8 px-8 py-7">
          {content.metrics.map((metric) => (
            <div key={metric.label} className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft/60 text-primary">
                <Icon name={metric.icon} className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-slate-400">
                  {metric.label}
                </span>
                <span className="font-heading text-base font-extrabold text-ink">
                  {metric.value}
                </span>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-4 border-l border-slate-200 pl-0 sm:pl-8">
            <div className="flex -space-x-2">
              {content.rating.avatars.map((avatar) => (
                <img
                  key={avatar.src}
                  src={avatar.src}
                  alt={avatar.alt}
                  className="h-9 w-9 rounded-full border-2 border-white object-cover"
                />
              ))}
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary-soft text-[10px] font-extrabold text-primary">
                +1k
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-1 text-secondary">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Icon key={index} name="star" />
                ))}
              </div>
              <span className="font-heading text-sm font-extrabold text-ink">
                {content.rating.value} {content.rating.label}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
