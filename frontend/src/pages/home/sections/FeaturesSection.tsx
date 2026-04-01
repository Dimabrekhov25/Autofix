import type { HomePageContent } from '../../../shared/types/content'
import { Container } from '../../../shared/ui/Container'
import { Icon } from '../../../shared/ui/Icon'
import { SectionHeading } from '../../../shared/ui/SectionHeading'

interface FeaturesSectionProps {
  id: string
  content: HomePageContent['features']
}

export function FeaturesSection({ id, content }: FeaturesSectionProps) {
  return (
    <section id={id} className="section-anchor py-28 sm:py-32">
      <Container>
        <SectionHeading title={content.title} description={content.description} />

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {content.items.map((item) => (
            <article
              key={item.title}
              className="group rounded-4xl border border-transparent bg-white px-8 py-9 shadow-card transition duration-500 hover:-translate-y-1 hover:border-primary/10 hover:shadow-soft"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft/50 text-primary transition-colors duration-500 group-hover:bg-primary-soft">
                <Icon name={item.icon} className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-heading text-2xl font-extrabold tracking-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-ink-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
