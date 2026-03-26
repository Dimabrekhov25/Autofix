import type { HomePageContent } from '../../../shared/types/content'
import { Button } from '../../../shared/ui/Button'
import { Container } from '../../../shared/ui/Container'

interface CtaSectionProps {
  id: string
  content: HomePageContent['cta']
}

export function CtaSection({ id, content }: CtaSectionProps) {
  return (
    <section id={id} className="section-anchor py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[3rem] bg-primary px-8 py-16 text-center text-white shadow-soft sm:px-14 sm:py-24">
          <img
            src={content.backgroundImage.src}
            alt={content.backgroundImage.alt}
            className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-primary-radial" />

          <div className="relative z-10 mx-auto max-w-4xl">
            <h2 className="text-balance font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {content.title}
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/80">
              {content.description}
            </p>
            <Button
              to={content.action.to}
              tone={content.action.tone}
              className="mt-12 px-10 py-5 text-lg"
            >
              {content.action.label}
            </Button>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-extrabold uppercase tracking-[0.24em] text-white/70">
              {content.highlights.map((highlight) => (
                <span key={highlight}>{highlight}</span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
