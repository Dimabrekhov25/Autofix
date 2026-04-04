interface ApiResultError {
  message: string
  code?: string | null
  validationErrors?: Record<string, string[]> | null
  details?: unknown
}

interface ApiResultEnvelope<T> {
  status: boolean
  data: T | null
  error: ApiResultError | null
  createdAt: string
}

export interface CatalogPartDto {
  id: string
  name: string
  unitPrice: number
  isActive: boolean
}

export interface ServiceCatalogRequiredPartDto {
  partId: string
  partName: string
  unitPrice: number
  quantity: number
}

export interface ServiceCatalogRequiredPartInputDto {
  partId: string
  quantity: number
}

export interface ServiceCatalogItemDto {
  id: string
  name: string
  description: string
  category: 0 | 1
  basePrice: number
  estimatedLaborCost: number
  estimatedDuration: string
  isActive: boolean
  requiredParts: ServiceCatalogRequiredPartDto[]
}

export interface CreateServiceCatalogItemPayload {
  name: string
  description: string
  category: 0 | 1
  basePrice: number
  estimatedLaborCost: number
  estimatedDuration: string
  isActive: boolean
  requiredParts?: ServiceCatalogRequiredPartInputDto[]
}

export interface UpdateServiceCatalogItemPayload extends CreateServiceCatalogItemPayload {
  id: string
}

export interface CreateCatalogPartPayload {
  name: string
  unitPrice: number
  isActive: boolean
}

export interface UpdateCatalogPartPayload extends CreateCatalogPartPayload {
  id: string
}

const CATALOG_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '')

export class CatalogApiError extends Error {
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
    this.name = 'CatalogApiError'
    this.code = options.code
    this.statusCode = options.statusCode
    this.validationErrors = options.validationErrors
    this.details = options.details
  }
}

function createEndpointUrl(path: string) {
  return `${CATALOG_API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
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
    throw new CatalogApiError('The server returned an unreadable response.', {
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

  if (!response.ok || !envelope?.status || envelope.data === null) {
    throw new CatalogApiError(
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

export function getCatalogErrorMessage(
  error: unknown,
  fallbackMessage = 'Unable to complete the request.',
) {
  if (error instanceof CatalogApiError) {
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

export function getPartsRequest(accessToken?: string) {
  return request<CatalogPartDto[]>('/Parts', { method: 'GET' }, accessToken)
}

export function getServiceCatalogItemsRequest(
  options: {
    category?: 0 | 1
    isActive?: boolean
    bookableOnly?: boolean
  } = {},
  accessToken?: string,
) {
  const params = new URLSearchParams()

  if (typeof options.category === 'number') {
    params.set('category', String(options.category))
  }

  if (typeof options.isActive === 'boolean') {
    params.set('isActive', String(options.isActive))
  }

  if (typeof options.bookableOnly === 'boolean') {
    params.set('bookableOnly', String(options.bookableOnly))
  }

  const suffix = params.size > 0 ? `?${params.toString()}` : ''
  return request<ServiceCatalogItemDto[]>(`/ServiceCatalog${suffix}`, { method: 'GET' }, accessToken)
}

export function createServiceCatalogItemRequest(
  payload: CreateServiceCatalogItemPayload,
  accessToken?: string,
) {
  return request<ServiceCatalogItemDto>(
    '/ServiceCatalog',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export function updateServiceCatalogItemRequest(
  payload: UpdateServiceCatalogItemPayload,
  accessToken?: string,
) {
  return request<ServiceCatalogItemDto>(
    `/ServiceCatalog/${payload.id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export async function deleteServiceCatalogItemRequest(id: string, accessToken?: string) {
  await request<Record<string, never>>(
    `/ServiceCatalog/${id}`,
    {
      method: 'DELETE',
    },
    accessToken,
  )
}

export function createPartRequest(
  payload: CreateCatalogPartPayload,
  accessToken?: string,
) {
  return request<CatalogPartDto>(
    '/Parts',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export function updatePartRequest(
  payload: UpdateCatalogPartPayload,
  accessToken?: string,
) {
  return request<CatalogPartDto>(
    `/Parts/${payload.id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export async function deletePartRequest(id: string, accessToken?: string) {
  await request<Record<string, never>>(
    `/Parts/${id}`,
    {
      method: 'DELETE',
    },
    accessToken,
  )
}
