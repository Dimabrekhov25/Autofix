import { useTranslation } from 'react-i18next'

import { LoginForm } from '../../features/auth/components/LoginForm'
import { AuthShell } from '../../widgets/auth-shell/AuthShell'

export function LoginPage() {
  const { t } = useTranslation()

  return (
    <AuthShell
      eyebrow={t('auth.loginPage.eyebrow')}
      title={t('auth.loginPage.title')}
      description={t('auth.loginPage.description')}
    >
      <LoginForm />
    </AuthShell>
  )
}
