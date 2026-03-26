import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { APP_ROUTES } from '../../../shared/config/routes'
import { Button } from '../../../shared/ui/Button'
import { TextField } from '../../../shared/ui/TextField'
import { useAuth } from '../useAuth'
import {
  createEmptyVehicle,
  createInitialRegisterForm,
  toRegisterPayload,
  type RegisterFormModel,
} from '../types/register'

export function RegisterForm() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState<RegisterFormModel>(() => createInitialRegisterForm())
  const [showPassword, setShowPassword] = useState(false)

  const updateField = <K extends keyof RegisterFormModel>(
    key: K,
    value: RegisterFormModel[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const updateVehicle = (
    vehicleId: string,
    key: 'licensePlate' | 'brandModel',
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      vehicles: current.vehicles.map((vehicle) =>
        vehicle.id === vehicleId ? { ...vehicle, [key]: value } : vehicle,
      ),
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    register(toRegisterPayload(form))
    navigate(APP_ROUTES.dashboard)
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField
          label="Full Name"
          placeholder="John Doe"
          value={form.fullName}
          onChange={(event) => updateField('fullName', event.target.value)}
        />
        <TextField
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="********"
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
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
        <TextField
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="********"
          value={form.confirmPassword}
          onChange={(event) => updateField('confirmPassword', event.target.value)}
        />
      </div>

      <section className="rounded-[1.4rem] bg-surface-container-low p-6">
        <h3 className="mb-4 text-sm font-headline font-bold">Initial Vehicle</h3>
        <div className="space-y-4">
          {form.vehicles.map((vehicle, index) => (
            <div key={vehicle.id} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                label={`License Plate ${index + 1}`}
                placeholder="ABC-1234"
                inputClassName="bg-white"
                value={vehicle.licensePlate}
                onChange={(event) =>
                  updateVehicle(vehicle.id, 'licensePlate', event.target.value)
                }
              />
              <TextField
                label={`Brand / Model ${index + 1}`}
                placeholder="Tesla Model 3"
                inputClassName="bg-white"
                value={vehicle.brandModel}
                onChange={(event) =>
                  updateVehicle(vehicle.id, 'brandModel', event.target.value)
                }
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary transition hover:opacity-80"
          onClick={() =>
            setForm((current) => ({
              ...current,
              vehicles: [...current.vehicles, createEmptyVehicle()],
            }))
          }
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">+</span>
          Add another vehicle
        </button>
      </section>

      <Button type="submit" className="w-full">
        Register
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
