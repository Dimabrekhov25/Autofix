import { createContext } from 'react'

import type { MockAuthState } from './auth-mock'
import type { RegisterSubmissionPayload } from './types/register'

export interface AuthContextValue extends MockAuthState {
  loginAsDemo: () => void
  logout: () => void
  register: (payload: RegisterSubmissionPayload) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
