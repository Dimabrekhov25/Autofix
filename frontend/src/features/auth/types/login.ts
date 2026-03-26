export interface LoginFormModel {
  email: string
  password: string
}

export interface LoginSubmissionPayload {
  email: string
  password: string
}

export function createInitialLoginForm(): LoginFormModel {
  return {
    email: '',
    password: '',
  }
}

export function toLoginPayload(form: LoginFormModel): LoginSubmissionPayload {
  return {
    email: form.email.trim(),
    password: form.password,
  }
}
