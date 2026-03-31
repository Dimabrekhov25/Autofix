import { RegisterForm } from '../../features/auth/components/RegisterForm'
import { AuthShell } from '../../widgets/auth-shell/AuthShell'

export function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Client Onboarding"
      title="Create your AUTOFIX account."
      description="Register to manage bookings, review service history, and keep every vehicle profile in one place."
    >
      <RegisterForm />
    </AuthShell>
  )
}
