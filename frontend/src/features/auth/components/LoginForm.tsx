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
import { createInitialLoginForm, toLoginPayload } from '../types/login'

export function LoginForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, loginWithGoogle } = useAuth()
  const [form, setForm] = useState(createInitialLoginForm)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.identifier.trim() || !form.password) {
      setErrorMessage(t('auth.login.missingCredentials'))
      return
    }

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await login(toLoginPayload(form))
      navigate(APP_ROUTES.dashboard)
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, t('auth.login.failed')))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleSignIn(idToken: string) {
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await loginWithGoogle(idToken)
      navigate(APP_ROUTES.dashboard)
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, t('auth.login.googleFailed')))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="mb-10">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary">
          {t('auth.login.eyebrow')}
        </p>
        <h2 className="mt-3 text-3xl font-headline font-bold text-on-background">
          {t('auth.login.title')}
        </h2>
      </div>

      <GoogleSignInCard
        disabled={isSubmitting}
        mode="login"
        onCredential={handleGoogleSignIn}
      />

      <div className="relative flex items-center justify-center py-1">
        <div className="absolute inset-x-0 h-px bg-outline-variant/20" />
        <span className="relative bg-surface-container-lowest px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
          {t('auth.login.separator')}
        </span>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 text-sm text-error">
          {errorMessage}
        </div>
      ) : null}

      <TextField
        autoComplete="username"
        disabled={isSubmitting}
        label={t('auth.login.identifierLabel')}
        placeholder="client@autofix.dev"
        value={form.identifier}
        onChange={(event) =>
          setForm((current) => ({ ...current, identifier: event.target.value }))
        }
      />

      <TextField
        autoComplete="current-password"
        disabled={isSubmitting}
        label={t('auth.login.passwordLabel')}
        type={showPassword ? 'text' : 'password'}
        placeholder="********"
        value={form.password}
        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
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

      <Button type="submit" className="w-full">
        {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
      </Button>

      <p className="text-center text-sm text-on-surface-variant">
        {t('auth.login.needAccount')}{' '}
        <Link className="font-bold text-primary hover:underline" to={APP_ROUTES.register}>
          {t('auth.login.registerHere')}
        </Link>
      </p>
    </form>
  )
}
