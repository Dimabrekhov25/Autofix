import { useTranslation } from 'react-i18next'

import { RegisterForm } from '../../features/auth/components/RegisterForm'
import { AuthShell } from '../../widgets/auth-shell/AuthShell'

export function RegisterPage() {
  const { t } = useTranslation()

  return (
    <AuthShell
      eyebrow={t('auth.registerPage.eyebrow')}
      title={t('auth.registerPage.title')}
      description={t('auth.registerPage.description')}
    >
      <RegisterForm />
    </AuthShell>
  )
}
