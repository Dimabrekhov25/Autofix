import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { APP_ROUTES } from '../../../shared/config/routes'
import { Button } from '../../../shared/ui/Button'
import { TextField } from '../../../shared/ui/TextField'
import { useAuth } from '../useAuth'
import { createInitialLoginForm, toLoginPayload } from '../types/login'

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState(createInitialLoginForm)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    login(toLoginPayload(form))
    navigate(APP_ROUTES.dashboard)
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="mb-10">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary">
          Login
        </p>
        <h2 className="mt-3 text-3xl font-headline font-bold text-on-background">
          Access your workshop control panel
        </h2>
      </div>

      <TextField
        label="Email Address"
        type="email"
        placeholder="client@autofix.dev"
        value={form.email}
        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
      />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="********"
        value={form.password}
        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
        trailingAction={
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="text-on-surface-variant transition hover:text-on-surface"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        }
      />

      <Button type="submit" className="w-full">
        Sign In
      </Button>

      <p className="text-center text-sm text-on-surface-variant">
        Need an account?{' '}
        <Link className="font-bold text-primary hover:underline" to={APP_ROUTES.register}>
          Register here
        </Link>
      </p>
    </form>
  )
}
