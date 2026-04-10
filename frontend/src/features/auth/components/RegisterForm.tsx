import { useState } from 'react'
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
      return 'Fill in your full name and email address.'
    }

    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match.'
    }

    if (form.password.length < 12) {
      return 'Password must be at least 12 characters long.'
    }

    if (!/[A-Z]/.test(form.password)) {
      return 'Password must include at least one uppercase letter.'
    }

    if (!/[a-z]/.test(form.password)) {
      return 'Password must include at least one lowercase letter.'
    }

    if (!/[0-9]/.test(form.password)) {
      return 'Password must include at least one number.'
    }

    if (!/[^a-zA-Z0-9]/.test(form.password)) {
      return 'Password must include at least one special character.'
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
      setErrorMessage(getAuthErrorMessage(error, 'Unable to create the account right now.'))
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
      setErrorMessage(getAuthErrorMessage(error, 'Google registration failed.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="mb-10">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary">
          Register
        </p>
        <h2 className="mt-3 text-3xl font-headline font-bold text-on-background">
          Build your AUTOFIX account
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
          Or create with email
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
          label="Full Name"
          placeholder="John Doe"
          value={form.fullName}
          onChange={(event) => updateField('fullName', event.target.value)}
        />
        <TextField
          autoComplete="email"
          disabled={isSubmitting}
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField
          autoComplete="new-password"
          disabled={isSubmitting}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="At least 12 characters"
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
          trailingAction={
            <button
              aria-label={showPassword ? 'Hide password' : 'Show password'}
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
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="********"
          value={form.confirmPassword}
          onChange={(event) => updateField('confirmPassword', event.target.value)}
        />
      </div>

      <section className="rounded-[1.4rem] border border-outline-variant/20 bg-surface-container-low px-5 py-4">
        <p className="text-sm font-headline font-bold text-on-background">
          Password requirements
        </p>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          Use at least 12 characters with uppercase, lowercase, number, and special symbol to
          meet password requirements.
        </p>
      </section>

      <Button type="submit" className="w-full">
        {isSubmitting ? 'Creating Account...' : 'Register'}
      </Button>

      <p className="text-center text-sm text-on-surface-variant">
        Already have an account?{' '}
        <Link className="font-bold text-primary hover:underline" to={APP_ROUTES.login}>
          Log in
        </Link>
      </p>
    </form>
  )
}
