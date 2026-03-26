import { cn } from '../../../shared/lib/cn'
import type { HomePageContent } from '../../../shared/types/content'
import { Container } from '../../../shared/ui/Container'
import { SectionHeading } from '../../../shared/ui/SectionHeading'

interface WorkflowSectionProps {
  id: string
  content: HomePageContent['workflow']
}

export function WorkflowSection({ id, content }: WorkflowSectionProps) {
  return (
    <section id={id} className="section-anchor bg-surface-muted py-28 sm:py-32">
      <Container>
        <SectionHeading eyebrow={content.eyebrow} title={content.title} align="center" />

        <div className="relative mt-16">
          <div className="absolute left-0 top-8 hidden h-px w-full bg-slate-200 lg:block" />

          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-5">
            {content.steps.map((step) => (
              <article key={step.number} className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    'mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 bg-white font-heading text-2xl font-black',
                    step.emphasized
                      ? 'border-primary text-primary shadow-soft'
                      : 'border-slate-200 text-ink-muted shadow-card',
                  )}
                >
                  {step.number}
                </div>
                <h3 className="font-heading text-xl font-extrabold text-ink">{step.title}</h3>
                <p className="mt-2 max-w-[14rem] text-sm leading-6 text-ink-muted">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
