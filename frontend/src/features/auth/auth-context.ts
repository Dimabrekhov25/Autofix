import { createContext } from 'react'

import type { AuthState } from './auth-types'
import type { LoginSubmissionPayload } from './types/login'
import type { RegisterSubmissionPayload } from './types/register'

export interface AuthContextValue extends AuthState {
  login: (payload: LoginSubmissionPayload) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<void>
  logout: () => Promise<void>
  register: (payload: RegisterSubmissionPayload) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
