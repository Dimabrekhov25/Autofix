import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'

import {
  getAuthErrorMessage,
  getCurrentUserRequest,
  googleLoginRequest,
  loginRequest,
  logoutRequest,
  refreshTokenRequest,
  registerRequest,
} from './auth-api'
import {
  clearPersistedAuthSession,
  persistAuthSession,
  readPersistedAuthSession,
} from './auth-storage'
import {
  createAnonymousAuthState,
  createAuthenticatedState,
  createLoadingAuthState,
  normalizeAuthUser,
  type AuthResponseDto,
  type AuthState,
  type PersistedAuthSession,
} from './auth-types'
import { AuthContext, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>(() => createLoadingAuthState())

  useEffect(() => {
    let isMounted = true

    async function restoreSession() {
      const persistedSession = readPersistedAuthSession()

      if (!persistedSession?.tokens) {
        if (isMounted) {
          setState(createAnonymousAuthState())
        }
        return
      }

      try {
        const currentUser = await getCurrentUserRequest(persistedSession.tokens.accessToken)
        const nextSession = {
          user: normalizeAuthUser(currentUser),
          tokens: persistedSession.tokens,
        } satisfies PersistedAuthSession

        persistAuthSession(nextSession)

        if (isMounted) {
          setState(createAuthenticatedState(nextSession))
        }

        return
      } catch {
        try {
          const refreshedAuth = await refreshTokenRequest(
            persistedSession.tokens.refreshToken,
          )
          const nextSession = createPersistedSession(refreshedAuth)
          persistAuthSession(nextSession)

          if (isMounted) {
            setState(createAuthenticatedState(nextSession))
          }

          return
        } catch {
          clearPersistedAuthSession()

          if (isMounted) {
            setState(createAnonymousAuthState())
          }
        }
      }
    }

    void restoreSession()

    return () => {
      isMounted = false
    }
  }, [])

  function applySession(authResponse: AuthResponseDto) {
    const nextSession = createPersistedSession(authResponse)
    persistAuthSession(nextSession)
    setState(createAuthenticatedState(nextSession))
  }

  async function login(payload: AuthContextValue['login'] extends (
    payload: infer T,
  ) => Promise<void>
    ? T
    : never) {
    const authResponse = await loginRequest(payload)
    applySession(authResponse)
  }

  async function register(payload: AuthContextValue['register'] extends (
    payload: infer T,
  ) => Promise<void>
    ? T
    : never) {
    const authResponse = await registerRequest(payload)
    applySession(authResponse)
  }

  async function loginWithGoogle(idToken: string) {
    const authResponse = await googleLoginRequest(idToken)
    applySession(authResponse)
  }

  async function logout() {
    const refreshToken = state.tokens?.refreshToken
    const accessToken = state.tokens?.accessToken

    clearPersistedAuthSession()
    setState(createAnonymousAuthState())

    if (!refreshToken) {
      return
    }

    try {
      await logoutRequest(refreshToken, accessToken)
    } catch (error) {
      console.warn(getAuthErrorMessage(error, 'Unable to revoke the current session on the server.'))
    }
  }

  const value: AuthContextValue = {
    ...state,
    login,
    loginWithGoogle,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function createPersistedSession(authResponse: AuthResponseDto): PersistedAuthSession {
  return {
    user: normalizeAuthUser(authResponse.user),
    tokens: authResponse.tokens,
  }
}
