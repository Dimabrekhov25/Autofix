import type { PersistedAuthSession } from './auth-types'

const AUTH_STORAGE_KEY = 'autofix.auth-session'

export function readPersistedAuthSession(): PersistedAuthSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as PersistedAuthSession
  } catch {
    return null
  }
}

export function persistAuthSession(session: PersistedAuthSession) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearPersistedAuthSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}
