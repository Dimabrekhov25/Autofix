export interface LoginFormModel {
  identifier: string
  password: string
}

export interface LoginSubmissionPayload {
  userNameOrEmail: string
  password: string
}

export function createInitialLoginForm(): LoginFormModel {
  return {
    identifier: '',
    password: '',
  }
}

export function toLoginPayload(form: LoginFormModel): LoginSubmissionPayload {
  return {
    userNameOrEmail: form.identifier.trim(),
    password: form.password,
  }
}
