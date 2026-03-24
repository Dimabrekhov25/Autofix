import { SiteFooter } from '../../../shared/layout/SiteFooter'
import { SiteHeader } from '../../../shared/layout/SiteHeader'
import { Container } from '../../../shared/ui/Container'

export function BookingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />
      <main className="flex-1 pt-20">
        <Container className="py-24">
          <div className="rounded-5xl bg-white p-12 shadow-card">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Booking Ready
            </span>
            <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-ink">
              Your authenticated booking flow starts here.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted">
              This route is protected and only resolves after mock authentication.
              It is ready to be replaced with real appointment scheduling once the backend is wired in.
            </p>
          </div>
        </Container>
      </main>
      <div id="footer" className="section-anchor" />
      <SiteFooter />
    </div>
  )
}
