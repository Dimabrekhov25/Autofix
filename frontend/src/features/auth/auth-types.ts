export interface AuthTokens {
  accessToken: string
  accessTokenExpiresAtUtc: string
  refreshToken: string
  refreshTokenExpiresAtUtc: string
}

export interface AuthApiUser {
  id: string
  userName: string
  email: string
  fullName: string
  isActive: boolean
  roles: string[]
}

export interface AuthUser extends AuthApiUser {
  initials: string
}

export interface PersistedAuthSession {
  user: AuthUser
  tokens: AuthTokens
}

export interface AuthState {
  isReady: boolean
  isAuthenticated: boolean
  user: AuthUser | null
  tokens: AuthTokens | null
}

export interface ApiResultError {
  message: string
  code?: string | null
  validationErrors?: Record<string, string[]> | null
  details?: unknown
}

export interface ApiResultEnvelope<T> {
  status: boolean
  data: T | null
  error: ApiResultError | null
  createdAt: string
}

export interface AuthResponseDto {
  user: AuthApiUser
  tokens: AuthTokens
}

function getInitials(fullName: string) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? '')
    .join('')
}

export function normalizeAuthUser(user: AuthApiUser): AuthUser {
  return {
    ...user,
    initials: getInitials(user.fullName || user.userName || 'AU'),
  }
}

export function hasRole(
  user: Pick<AuthApiUser, 'roles'> | null | undefined,
  role: string,
) {
  return user?.roles.some((item) => item.toLowerCase() === role.toLowerCase()) ?? false
}

export function isAdminUser(user: Pick<AuthApiUser, 'roles'> | null | undefined) {
  return hasRole(user, 'Admin')
}

export function createAuthenticatedState(session: PersistedAuthSession): AuthState {
  return {
    isReady: true,
    isAuthenticated: true,
    user: session.user,
    tokens: session.tokens,
  }
}

export function createAnonymousAuthState(): AuthState {
  return {
    isReady: true,
    isAuthenticated: false,
    user: null,
    tokens: null,
  }
}

export function createLoadingAuthState(): AuthState {
  return {
    isReady: false,
    isAuthenticated: false,
    user: null,
    tokens: null,
  }
}
