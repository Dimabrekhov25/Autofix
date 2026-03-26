import { createContext } from 'react'

import type { MockAuthState } from './auth-mock'
import type { LoginSubmissionPayload } from './types/login'
import type { RegisterSubmissionPayload } from './types/register'

export interface AuthContextValue extends MockAuthState {
  login: (payload: LoginSubmissionPayload) => void
  loginAsDemo: () => void
  logout: () => void
  register: (payload: RegisterSubmissionPayload) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
