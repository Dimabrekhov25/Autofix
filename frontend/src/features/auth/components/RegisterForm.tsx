import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { getAuthErrorMessage } from '../../../apis/authApi'
import { APP_ROUTES } from '../../../shared/config/routes'
import { Button } from '../../../shared/ui/Button'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import { TextField } from '../../../shared/ui/TextField'
import { useAuth } from '../useAuth'
import { GoogleSignInCard } from './GoogleSignInCard'
import { createInitialRegisterForm, toRegisterPayload, type RegisterFormModel } from '../types/register'

export function RegisterForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { loginWithGoogle, register } = useAuth()
  const [form, setForm] = useState<RegisterFormModel>(() => createInitialRegisterForm())
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const updateField = <K extends keyof RegisterFormModel>(
    key: K,
    value: RegisterFormModel[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function validateForm() {
    if (!form.fullName.trim() || !form.email.trim()) {
      return t('auth.register.validationNameEmail')
    }

    if (form.password !== form.confirmPassword) {
      return t('auth.register.validationPasswordMismatch')
    }

    if (form.password.length < 12) {
      return t('auth.register.validationPasswordLength')
    }

    if (!/[A-Z]/.test(form.password)) {
      return t('auth.register.validationPasswordUppercase')
    }

    if (!/[a-z]/.test(form.password)) {
      return t('auth.register.validationPasswordLowercase')
    }

    if (!/[0-9]/.test(form.password)) {
      return t('auth.register.validationPasswordNumber')
    }

    if (!/[^a-zA-Z0-9]/.test(form.password)) {
      return t('auth.register.validationPasswordSpecial')
    }

    return null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationMessage = validateForm()

    if (validationMessage) {
      setErrorMessage(validationMessage)
      return
    }

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await register(toRegisterPayload(form))
      navigate(APP_ROUTES.dashboard)
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, t('auth.register.failed')))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleRegistration(idToken: string) {
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await loginWithGoogle(idToken)
      navigate(APP_ROUTES.dashboard)
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, t('auth.register.googleFailed')))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="mb-10">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary">
          {t('auth.register.eyebrow')}
        </p>
        <h2 className="mt-3 text-3xl font-headline font-bold text-on-background">
          {t('auth.register.title')}
        </h2>
      </div>

      <GoogleSignInCard
        disabled={isSubmitting}
        mode="register"
        onCredential={handleGoogleRegistration}
      />

      <div className="relative flex items-center justify-center py-1">
        <div className="absolute inset-x-0 h-px bg-outline-variant/20" />
        <span className="relative bg-surface-container-lowest px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
          {t('auth.register.separator')}
        </span>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 text-sm text-error">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField
          autoComplete="name"
          disabled={isSubmitting}
          label={t('auth.register.fullNameLabel')}
          placeholder={t('auth.register.fullNamePlaceholder')}
          value={form.fullName}
          onChange={(event) => updateField('fullName', event.target.value)}
        />
        <TextField
          autoComplete="email"
          disabled={isSubmitting}
          label={t('auth.register.emailLabel')}
          type="email"
          placeholder={t('auth.register.emailPlaceholder')}
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField
          autoComplete="new-password"
          disabled={isSubmitting}
          label={t('auth.register.passwordLabel')}
          type={showPassword ? 'text' : 'password'}
          placeholder={t('auth.register.passwordPlaceholder')}
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
          trailingAction={
            <button
              aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-white/70 hover:text-on-surface"
            >
              <MaterialIcon
                name={showPassword ? 'visibility_off' : 'visibility'}
                className="text-[1.15rem]"
              />
            </button>
          }
        />
        <TextField
          autoComplete="new-password"
          disabled={isSubmitting}
          label={t('auth.register.confirmPasswordLabel')}
          type={showPassword ? 'text' : 'password'}
          placeholder="********"
          value={form.confirmPassword}
          onChange={(event) => updateField('confirmPassword', event.target.value)}
        />
      </div>

      <section className="rounded-[1.4rem] border border-outline-variant/20 bg-surface-container-low px-5 py-4">
        <p className="text-sm font-headline font-bold text-on-background">
          {t('auth.register.requirementsTitle')}
        </p>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          {t('auth.register.requirementsDescription')}
        </p>
      </section>

      <Button type="submit" className="w-full">
        {isSubmitting ? t('auth.register.submitting') : t('auth.register.submit')}
      </Button>

      <p className="text-center text-sm text-on-surface-variant">
        {t('auth.register.alreadyHaveAccount')}{' '}
        <Link className="font-bold text-primary hover:underline" to={APP_ROUTES.login}>
          {t('auth.register.logIn')}
        </Link>
      </p>
    </form>
  )
}
