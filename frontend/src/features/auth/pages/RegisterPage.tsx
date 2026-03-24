import { SiteFooter } from '../../../shared/layout/SiteFooter'
import { SiteHeader } from '../../../shared/layout/SiteHeader'
import { RegisterForm } from '../components/RegisterForm'
import { RegisterVisualPanel } from '../components/RegisterVisualPanel'

export function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 pb-12 pt-24">
        <div className="min-h-[700px] w-full max-w-[1000px] overflow-hidden rounded-4xl bg-white shadow-[0_20px_40px_rgba(45,47,49,0.06)] md:flex">
          <RegisterVisualPanel />
          <RegisterForm />
        </div>
      </main>
      <SiteFooter variant="compact" />
    </div>
  )
}
