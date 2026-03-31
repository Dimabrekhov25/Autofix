export interface RegisterFormModel {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterSubmissionPayload {
  userName: string
  email: string
  fullName: string
  password: string
}

export function createInitialRegisterForm(): RegisterFormModel {
  return {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  }
}

function createUserName(email: string, fullName: string) {
  const localPart = email.split('@')[0]?.trim() ?? fullName
  const normalized = localPart
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '.')
    .replace(/^[._-]+|[._-]+$/g, '')

  return (normalized || `user.${crypto.randomUUID().slice(0, 8)}`).slice(0, 50)
}

export function toRegisterPayload(form: RegisterFormModel): RegisterSubmissionPayload {
  return {
    userName: createUserName(form.email.trim(), form.fullName.trim()),
    email: form.email.trim(),
    fullName: form.fullName.trim(),
    password: form.password,
  }
}
