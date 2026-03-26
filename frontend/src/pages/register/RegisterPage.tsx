import { RegisterForm } from '../../features/auth/components/RegisterForm'
import { AuthShell } from '../../widgets/auth-shell/AuthShell'

export function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Client Onboarding"
      title="Create your precision service profile."
      description="After registration, the client is redirected to the AUTOFIX dashboard page based on your provided HTML."
    >
      <RegisterForm />
    </AuthShell>
  )
}
