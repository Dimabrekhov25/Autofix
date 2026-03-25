import type { RegisterSubmissionPayload } from './types/register'

export interface MockAuthUser {
  id: string
  fullName: string
  email: string
  initials: string
}

export interface MockAuthState {
  isAuthenticated: boolean
  user: MockAuthUser | null
}

const AUTH_STORAGE_KEY = 'autofix.mock-auth'

function getInitials(fullName: string) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? '')
    .join('')
}

export function createMockUser(fullName: string, email: string): MockAuthUser {
  return {
    id: crypto.randomUUID(),
    fullName,
    email,
    initials: getInitials(fullName || 'AU'),
  }
}

export function readMockAuthState(): MockAuthState {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null }
  }

  const saved = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!saved) {
    return { isAuthenticated: false, user: null }
  }

  try {
    return JSON.parse(saved) as MockAuthState
  } catch {
    return { isAuthenticated: false, user: null }
  }
}

export function persistMockAuthState(state: MockAuthState) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))
}

export function createDemoSession(): MockAuthState {
  return {
    isAuthenticated: true,
    user: createMockUser('Avery Precision', 'avery@autofix.dev'),
  }
}

export function registerMockSession(
  payload: RegisterSubmissionPayload,
): MockAuthState {
  return {
    isAuthenticated: true,
    user: createMockUser(payload.profile.fullName, payload.profile.email),
  }
}
