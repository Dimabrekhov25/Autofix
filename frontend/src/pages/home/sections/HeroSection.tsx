import { cn } from '../../../shared/lib/cn'
import type { HeroContent } from '../../../shared/types/content'
import { Button } from '../../../shared/ui/Button'
import { Container } from '../../../shared/ui/Container'

interface HeroSectionProps {
  content: HeroContent
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[880px] items-center section-anchor">
      <div className="absolute inset-0">
        <img
          src={content.backgroundImage.src}
          alt={content.backgroundImage.alt}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,246,249,0.98)_0%,rgba(246,246,249,0.92)_38%,rgba(246,246,249,0.18)_100%)]" />
      </div>

      <Container className="relative z-10 py-20">
        <div className="max-w-2xl">
          <span className="mb-6 inline-flex rounded-full bg-primary-soft px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.28em] text-primary">
            {content.eyebrow}
          </span>

          <h1 className="text-balance font-heading text-5xl font-extrabold leading-[0.95] tracking-[-0.06em] text-ink sm:text-6xl lg:text-7xl">
            {content.segments.map((segment, index) => (
              <span
                key={`${segment.text}-${index}`}
                className={cn(segment.highlight && 'italic text-primary')}
              >
                {segment.text}
                {segment.breakAfter ? <br /> : null}
              </span>
            ))}
          </h1>

          <p className="mt-8 max-w-xl text-lg font-medium leading-8 text-ink-muted">
            {content.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {content.actions.map((action) => (
              <Button
                key={action.label}
                to={action.to}
                tone={action.tone}
                className="px-8 py-4 text-base"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
