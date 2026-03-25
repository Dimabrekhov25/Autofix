import { cn } from '../../../shared/lib/cn'
import type { HomePageContent } from '../../../shared/types/content'
import { Container } from '../../../shared/ui/Container'
import { Icon } from '../../../shared/ui/Icon'
import { SectionHeading } from '../../../shared/ui/SectionHeading'

interface TestimonialsSectionProps {
  id: string
  content: HomePageContent['testimonials']
}

export function TestimonialsSection({ id, content }: TestimonialsSectionProps) {
  return (
    <section id={id} className="section-anchor bg-white py-28 sm:py-32">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading title={content.title} description={content.description} />
          <div className="flex gap-4">
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-ink transition hover:bg-slate-50">
              <Icon name="chevronLeft" />
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-ink transition hover:bg-slate-50">
              <Icon name="chevronRight" />
            </button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {content.items.map((item) => (
            <article
              key={item.author}
              className={cn(
                'relative rounded-5xl bg-surface px-8 py-10 shadow-card',
                item.featured && 'border-2 border-primary/10 shadow-soft',
              )}
            >
              <Icon
                name="quote"
                className="absolute right-8 top-6 h-16 w-16 text-primary-soft opacity-80"
              />
              <div className="flex gap-1 text-secondary">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Icon key={index} name="star" />
                ))}
              </div>
              <p className="mt-6 text-lg leading-8 text-ink">"{item.quote}"</p>
              <div className="mt-8 flex items-center gap-4">
                <img
                  src={item.avatar.src}
                  alt={item.avatar.alt}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-ink">{item.author}</p>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                    {item.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
