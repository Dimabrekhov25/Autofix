import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'

import {
  createDemoSession,
  loginMockSession,
  persistMockAuthState,
  readMockAuthState,
  registerMockSession,
  type MockAuthState,
} from './auth-mock'
import { AuthContext, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<MockAuthState>(() => readMockAuthState())

  useEffect(() => {
    persistMockAuthState(state)
  }, [state])

  const value: AuthContextValue = {
    ...state,
    login: (payload) => {
      setState(loginMockSession(payload))
    },
    loginAsDemo: () => {
      setState(createDemoSession())
    },
    logout: () => {
      setState({ isAuthenticated: false, user: null })
    },
    register: (payload) => {
      setState(registerMockSession(payload))
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
