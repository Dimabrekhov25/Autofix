import { LoginForm } from '../../features/auth/components/LoginForm'
import { AuthShell } from '../../widgets/auth-shell/AuthShell'

export function LoginPage() {
  return (
    <AuthShell
      eyebrow="Member Access"
      title="Return to your AUTOFIX dashboard."
      description="Sign in to manage bookings, review estimates, and continue through the atelier workflow."
    >
      <LoginForm />
    </AuthShell>
  )
}
