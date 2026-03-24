export interface VehicleRegistrationFormModel {
  id: string
  licensePlate: string
  brandModel: string
}

export interface RegisterFormModel {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  vehicles: VehicleRegistrationFormModel[]
}

export interface RegisterSubmissionPayload {
  profile: {
    fullName: string
    email: string
    password: string
  }
  vehicles: Array<{
    licensePlate: string
    brandModel: string
  }>
}

export function createEmptyVehicle(): VehicleRegistrationFormModel {
  return {
    id: crypto.randomUUID(),
    licensePlate: '',
    brandModel: '',
  }
}

export function createInitialRegisterForm(): RegisterFormModel {
  return {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    vehicles: [createEmptyVehicle()],
  }
}

export function toRegisterPayload(
  form: RegisterFormModel,
): RegisterSubmissionPayload {
  return {
    profile: {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
    },
    vehicles: form.vehicles.map((vehicle) => ({
      licensePlate: vehicle.licensePlate.trim(),
      brandModel: vehicle.brandModel.trim(),
    })),
  }
}
