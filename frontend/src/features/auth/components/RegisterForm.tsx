import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { APP_ROUTES } from '../../../shared/constants/routes'
import { Button } from '../../../shared/ui/Button'
import { Icon } from '../../../shared/ui/Icon'
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
  const { register, loginAsDemo } = useAuth()
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
    navigate(APP_ROUTES.booking)
  }

  return (
    <div className="flex-1 bg-white p-8 md:p-12">
      <div className="mb-10">
        <h2 className="font-heading text-2xl font-bold text-ink">Create Account</h2>
        <p className="mt-2 text-ink-muted">Set up your precision profile to begin.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
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
            placeholder="••••••••"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            trailingAction={
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-ink-muted transition hover:text-ink"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            }
          />
          <TextField
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(event) => updateField('confirmPassword', event.target.value)}
          />
        </div>

        <section className="rounded-3xl bg-surface-muted p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-heading text-sm font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary">
                <Icon name="tracking" className="h-4 w-4" />
              </span>
              Initial Vehicle
            </h3>
          </div>

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
                  placeholder="e.g., Tesla Model 3"
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
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
              +
            </span>
            Add another vehicle
          </button>
        </section>

        <div className="space-y-4 pt-4">
          <Button type="submit" className="w-full py-4 text-base">
            Create Account
          </Button>
          <p className="text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <button
              type="button"
              className="font-bold text-primary hover:underline"
              onClick={() => {
                loginAsDemo()
                navigate(APP_ROUTES.booking)
              }}
            >
              Log in
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}
