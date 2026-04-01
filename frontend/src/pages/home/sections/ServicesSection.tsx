import { cn } from '../../../shared/lib/cn'
import type { HomePageContent } from '../../../shared/types/content'
import { Button } from '../../../shared/ui/Button'
import { Container } from '../../../shared/ui/Container'

interface ServicesSectionProps {
  id: string
  content: HomePageContent['services']
}

export function ServicesSection({ id, content }: ServicesSectionProps) {
  return (
    <section id={id} className="section-anchor py-28 sm:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="flex min-h-[380px] flex-col justify-end rounded-5xl bg-ink px-10 py-12 text-white lg:col-span-2">
            <h2 className="max-w-md font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {content.title}
            </h2>
            <p className="mt-6 max-w-sm text-base leading-7 text-slate-300">
              {content.description}
            </p>
            <Button to={content.action.to} tone={content.action.tone} className="mt-8 w-fit">
              {content.action.label}
            </Button>
          </div>

          {content.items.map((item) => (
            <article
              key={item.title}
              className={cn(
                'group relative flex min-h-[220px] items-end overflow-hidden rounded-5xl p-8',
                item.wide && 'lg:col-span-2',
              )}
            >
              <img
                src={item.image.src}
                alt={item.image.alt}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <h3 className="relative font-heading text-2xl font-extrabold tracking-tight text-white">
                {item.title}
              </h3>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
