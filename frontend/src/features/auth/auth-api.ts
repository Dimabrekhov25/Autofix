import type { LoginSubmissionPayload } from './types/login'
import type { RegisterSubmissionPayload } from './types/register'
import type {
  ApiResultEnvelope,
  ApiResultError,
  AuthApiUser,
  AuthResponseDto,
} from './auth-types'

const AUTH_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '')

export class AuthApiError extends Error {
  code?: string | null
  statusCode: number
  validationErrors?: Record<string, string[]> | null
  details?: unknown

  constructor(message: string, options: {
    code?: string | null
    statusCode: number
    validationErrors?: Record<string, string[]> | null
    details?: unknown
  }) {
    super(message)
    this.name = 'AuthApiError'
    this.code = options.code
    this.statusCode = options.statusCode
    this.validationErrors = options.validationErrors
    this.details = options.details
  }
}

function createEndpointUrl(path: string) {
  return `${AUTH_API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

function getApiErrorMessage(
  error: ApiResultError | null | undefined,
  fallbackMessage: string,
) {
  const validationMessage = error?.validationErrors
    ? Object.values(error.validationErrors).flat().find(Boolean)
    : null

  return validationMessage || error?.message || fallbackMessage
}

async function parseApiEnvelope<T>(response: Response): Promise<ApiResultEnvelope<T> | null> {
  const responseText = await response.text()
  if (!responseText) {
    return null
  }

  try {
    return JSON.parse(responseText) as ApiResultEnvelope<T>
  } catch {
    throw new AuthApiError('The server returned an unreadable response.', {
      statusCode: response.status,
    })
  }
}

async function request<T>(
  path: string,
  init: RequestInit,
  accessToken?: string,
): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(createEndpointUrl(path), {
    ...init,
    headers,
  })

  const envelope = await parseApiEnvelope<T>(response)

  if (!response.ok || !envelope?.status || !envelope.data) {
    throw new AuthApiError(
      getApiErrorMessage(envelope?.error, `Request failed with status ${response.status}.`),
      {
        code: envelope?.error?.code,
        statusCode: response.status,
        validationErrors: envelope?.error?.validationErrors,
        details: envelope?.error?.details,
      },
    )
  }

  return envelope.data
}

export function getAuthErrorMessage(
  error: unknown,
  fallbackMessage = 'Unable to complete the request.',
) {
  if (error instanceof AuthApiError) {
    return getApiErrorMessage(
      {
        message: error.message,
        validationErrors: error.validationErrors,
      },
      fallbackMessage,
    )
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}

export function loginRequest(payload: LoginSubmissionPayload) {
  return request<AuthResponseDto>('/Auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function registerRequest(payload: RegisterSubmissionPayload) {
  return request<AuthResponseDto>('/Auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function googleLoginRequest(idToken: string) {
  return request<AuthResponseDto>('/Auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  })
}

export function refreshTokenRequest(refreshToken: string) {
  return request<AuthResponseDto>('/Auth/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })
}

export function logoutRequest(refreshToken: string, accessToken?: string) {
  return request<Record<string, never>>(
    '/Auth/logout',
    {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    },
    accessToken,
  )
}

export function getCurrentUserRequest(accessToken: string) {
  return request<AuthApiUser>(
    '/Auth/me',
    {
      method: 'GET',
    },
    accessToken,
  )
}
