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

export interface InventoryItemDto {
  id: string
  partId: string
  quantityOnHand: number
  reservedQuantity: number
  minLevel: number
}

export interface CreateInventoryItemPayload {
  partId: string
  quantityOnHand: number
  reservedQuantity: number
  minLevel: number
}

export interface UpdateInventoryItemPayload extends CreateInventoryItemPayload {
  id: string
}

const INVENTORY_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '')

export class InventoryApiError extends Error {
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
    this.name = 'InventoryApiError'
    this.code = options.code
    this.statusCode = options.statusCode
    this.validationErrors = options.validationErrors
    this.details = options.details
  }
}

function createEndpointUrl(path: string) {
  return `${INVENTORY_API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
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
    throw new InventoryApiError('The server returned an unreadable response.', {
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
    throw new InventoryApiError(
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

export function getInventoryErrorMessage(
  error: unknown,
  fallbackMessage = 'Unable to complete the request.',
) {
  if (error instanceof InventoryApiError) {
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

export function getInventoryItemsRequest(accessToken?: string) {
  return request<InventoryItemDto[]>('/Inventory', { method: 'GET' }, accessToken)
}

export function createInventoryItemRequest(
  payload: CreateInventoryItemPayload,
  accessToken?: string,
) {
  return request<InventoryItemDto>(
    '/Inventory',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export function updateInventoryItemRequest(
  payload: UpdateInventoryItemPayload,
  accessToken?: string,
) {
  return request<InventoryItemDto>(
    `/Inventory/${payload.id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export async function deleteInventoryItemRequest(id: string, accessToken?: string) {
  await request<Record<string, never>>(
    `/Inventory/${id}`,
    {
      method: 'DELETE',
    },
    accessToken,
  )
}
