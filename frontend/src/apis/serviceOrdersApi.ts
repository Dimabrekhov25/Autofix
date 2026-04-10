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

export interface ServiceOrderWorkItemDto {
  id: string
  description: string
  laborHours: number
  hourlyRate: number
  isOptional: boolean
  isApproved: boolean
  lineTotal: number
}

export interface ServiceOrderPartItemDto {
  id: string
  partId: string
  partName: string
  quantity: number
  unitPrice: number
  availability: 1 | 2
  isApproved: boolean
  lineTotal: number
}

export interface ServiceOrderDto {
  id: string
  bookingId: string
  customerId: string
  vehicleId: string
  mechanicId?: string | null
  status: 1 | 2 | 3 | 4 | 5 | 6 | 7
  estimatedLaborCost: number
  estimatedPartsCost: number
  estimatedTotalCost: number
  workItems: ServiceOrderWorkItemDto[]
  partItems: ServiceOrderPartItemDto[]
}

export interface ServiceOrderApprovalNotificationDto {
  serviceOrderId: string
  bookingId: string
  customerId: string
  vehicleId: string
  customerName: string
  vehicleDisplayName: string
  licensePlate: string
  bookingStartAt: string
  status: 1 | 2 | 3 | 4 | 5 | 6 | 7
  estimatedTotalCost: number
  requestedServices: string[]
  customerApprovedAt: string
  readAt?: string | null
}

const SERVICE_ORDERS_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '')

export class ServiceOrdersApiError extends Error {
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
    this.name = 'ServiceOrdersApiError'
    this.code = options.code
    this.statusCode = options.statusCode
    this.validationErrors = options.validationErrors
    this.details = options.details
  }
}

function createEndpointUrl(path: string) {
  return `${SERVICE_ORDERS_API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
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
    throw new ServiceOrdersApiError('The server returned an unreadable response.', {
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
    throw new ServiceOrdersApiError(
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

export function getServiceOrdersErrorMessage(
  error: unknown,
  fallbackMessage = 'Unable to complete the request.',
) {
  if (error instanceof ServiceOrdersApiError) {
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

export function getServiceOrderByBookingRequest(bookingId: string, accessToken?: string) {
  return request<ServiceOrderDto>(
    `/ServiceOrders/by-booking/${bookingId}`,
    { method: 'GET', cache: 'no-store' },
    accessToken,
  )
}

export function getCustomerApprovalNotificationsRequest(accessToken?: string) {
  return request<ServiceOrderApprovalNotificationDto[]>(
    '/ServiceOrders/customer-approval-notifications',
    { method: 'GET', cache: 'no-store' },
    accessToken,
  )
}

export function markCustomerApprovalNotificationReadRequest(
  serviceOrderId: string,
  accessToken?: string,
) {
  return request<ServiceOrderApprovalNotificationDto>(
    `/ServiceOrders/${serviceOrderId}/customer-approval-notifications/read`,
    { method: 'POST' },
    accessToken,
  )
}

export function addServiceOrderCatalogItemsRequest(
  payload: {
    id: string
    serviceCatalogItemIds: string[]
  },
  accessToken?: string,
) {
  return request<ServiceOrderDto>(
    `/ServiceOrders/${payload.id}/catalog-items`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export function addManualServiceOrderPartRequest(
  payload: {
    id: string
    partId: string
    quantity: number
  },
  accessToken?: string,
) {
  return request<ServiceOrderDto>(
    `/ServiceOrders/${payload.id}/parts`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export async function removeServiceOrderPartItemRequest(
  serviceOrderId: string,
  partItemId: string,
  accessToken?: string,
) {
  return request<ServiceOrderDto>(
    `/ServiceOrders/${serviceOrderId}/parts/${partItemId}`,
    {
      method: 'DELETE',
    },
    accessToken,
  )
}

export async function removeServiceOrderWorkItemRequest(
  serviceOrderId: string,
  workItemId: string,
  accessToken?: string,
) {
  return request<ServiceOrderDto>(
    `/ServiceOrders/${serviceOrderId}/work-items/${workItemId}`,
    {
      method: 'DELETE',
    },
    accessToken,
  )
}

export function updateServiceOrderWorkItemRequest(
  payload: {
    id: string
    workItemId: string
    laborHours: number
    hourlyRate: number
  },
  accessToken?: string,
) {
  return request<ServiceOrderDto>(
    `/ServiceOrders/${payload.id}/work-items/${payload.workItemId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export function updateServiceOrderStatusRequest(
  payload: {
    id: string
    status: 1 | 2 | 3 | 4 | 5 | 6 | 7
  },
  accessToken?: string,
) {
  return request<ServiceOrderDto>(
    `/ServiceOrders/${payload.id}/status`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}
