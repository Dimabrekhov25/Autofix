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

interface PagedResult<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface CustomerDto {
  id: string
  userId: string
  fullName: string
  phone: string
  email?: string | null
  notes?: string | null
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

export interface ServiceCatalogRequiredPartDto {
  partId: string
  partName: string
  unitPrice: number
  quantity: number
}

export interface BookingAvailableSlotDto {
  id: string
  startAt: string
  endAt: string
  label: string
  isAvailable: boolean
  overlappingBookings: number
}

export interface BookingAvailableSlotsDto {
  date: string
  totalDuration: string
  slots: BookingAvailableSlotDto[]
}

export interface VehicleDto {
  id: string
  ownerCustomerId: string
  licensePlate: string
  vin: string
  make: string
  model: string
  year: number
  trim?: string | null
  engine?: string | null
  isDrivable: boolean
}

export interface VinDecodeResultDto {
  vin: string
  matchedExistingVehicle: boolean
  make?: string | null
  model?: string | null
  year?: number | null
  trim?: string | null
  engine?: string | null
}

export interface BookingQuoteVehicleDto {
  id: string
  licensePlate: string
  vin: string
  make: string
  model: string
  year: number
  trim?: string | null
  engine?: string | null
}

export interface BookingQuoteScheduleDto {
  startAt: string
  endAt: string
  totalDuration: string
}

export interface BookingPricingDto {
  subtotal: number
  estimatedLaborCost: number
  taxAmount: number
  totalEstimate: number
  currency: string
}

export interface BookingQuoteServiceDto {
  serviceCatalogItemId: string
  name: string
  description: string
  category: 0 | 1
  basePrice: number
  estimatedLaborCost: number
  estimatedDuration: string
  requiredParts: ServiceCatalogRequiredPartDto[]
}

export interface BookingQuoteDto {
  vehicle: BookingQuoteVehicleDto
  schedule: BookingQuoteScheduleDto
  pricing: BookingPricingDto
  services: BookingQuoteServiceDto[]
  availablePaymentOptions: number[]
}

export interface BookingServiceItemDto {
  id: string
  serviceCatalogItemId: string
  name: string
  description: string
  category: number
  basePrice: number
  estimatedLaborCost: number
  estimatedDuration: string
}

export interface BookingEstimateWorkItemDto {
  id: string
  description: string
  laborHours: number
  hourlyRate: number
  lineTotal: number
}

export interface BookingEstimatePartItemDto {
  id: string
  partId: string
  partName: string
  quantity: number
  unitPrice: number
  availability: 1 | 2
  lineTotal: number
}

export interface BookingEstimateDto {
  serviceOrderId: string
  status: 1 | 2 | 3 | 4 | 5 | 6 | 7
  estimatedLaborCost: number
  estimatedPartsCost: number
  estimatedTotalCost: number
  workItems: BookingEstimateWorkItemDto[]
  partItems: BookingEstimatePartItemDto[]
}

export interface BookingVehicleDto {
  id: string
  licensePlate: string
  vin?: string | null
  make: string
  model: string
  year: number
  trim?: string | null
  engine?: string | null
  isDrivable: boolean
}

export interface BookingDto {
  id: string
  customerId: string
  vehicleId: string
  vehicle?: BookingVehicleDto | null
  startAt: string
  endAt: string
  status: number
  paymentOption: number
  pricing: BookingPricingDto
  notes?: string | null
  services: BookingServiceItemDto[]
  estimate?: BookingEstimateDto | null
  createdAt: string
  updatedAt?: string | null
}

export interface CreateVehiclePayload {
  ownerCustomerId: string
  licensePlate: string
  vin: string
  make: string
  model: string
  year: number
  trim?: string | null
  engine?: string | null
  isDrivable: boolean
}

export interface CreateCustomerPayload {
  userId: string
  fullName: string
  phone: string
  email?: string | null
  notes?: string | null
}

export interface BookingQuotePayload {
  vehicleId: string
  startAt: string
  serviceCatalogItemIds: string[]
}

export interface CreateBookingPayload extends BookingQuotePayload {
  customerId: string
  notes?: string | null
}

const BOOKING_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '')

export class BookingApiError extends Error {
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
    this.name = 'BookingApiError'
    this.code = options.code
    this.statusCode = options.statusCode
    this.validationErrors = options.validationErrors
    this.details = options.details
  }
}

function createEndpointUrl(path: string) {
  return `${BOOKING_API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
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
    throw new BookingApiError('The server returned an unreadable response.', {
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
    throw new BookingApiError(
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

export function getBookingErrorMessage(
  error: unknown,
  fallbackMessage = 'Unable to complete the request.',
) {
  if (error instanceof BookingApiError) {
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

export function getServiceCatalogItemsRequest(
  options: {
    category: 0 | 1
    isActive?: boolean
    bookableOnly?: boolean
  },
  accessToken?: string,
) {
  const params = new URLSearchParams()
  params.set('category', String(options.category))
  if (typeof options.isActive === 'boolean') {
    params.set('isActive', String(options.isActive))
  }
  if (typeof options.bookableOnly === 'boolean') {
    params.set('bookableOnly', String(options.bookableOnly))
  }

  return request<ServiceCatalogItemDto[]>(
    `/ServiceCatalog?${params.toString()}`,
    { method: 'GET' },
    accessToken,
  )
}

export function getAvailableBookingSlotsRequest(
  options: {
    date: string
    serviceCatalogItemIds: string[]
  },
  accessToken?: string,
) {
  const params = new URLSearchParams()
  params.set('date', options.date)

  options.serviceCatalogItemIds.forEach((id) => {
    params.append('serviceCatalogItemIds', id)
  })

  return request<BookingAvailableSlotsDto>(
    `/Bookings/slots?${params.toString()}`,
    { method: 'GET', cache: 'no-store' },
    accessToken,
  )
}

export function getCustomersRequest(accessToken?: string) {
  return request<CustomerDto[]>('/Customers', { method: 'GET' }, accessToken)
}

export function createCustomerRequest(payload: CreateCustomerPayload, accessToken?: string) {
  return request<CustomerDto>(
    '/Customers',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export async function getCurrentCustomerRequest(userId: string, accessToken?: string) {
  const customers = await getCustomersRequest(accessToken)
  const currentCustomer = customers.find((customer) => customer.userId === userId)

  if (!currentCustomer) {
    throw new BookingApiError('Current customer profile was not found.', {
      statusCode: 404,
    })
  }

  return currentCustomer
}

export async function ensureCurrentCustomerRequest(
  payload: {
    userId: string
    fullName: string
    email?: string | null
  },
  accessToken?: string,
) {
  try {
    return await getCurrentCustomerRequest(payload.userId, accessToken)
  } catch (error) {
    const isNotFound = error instanceof BookingApiError && error.statusCode === 404
    if (!isNotFound) {
      throw error
    }

    try {
      return await createCustomerRequest(
        {
          userId: payload.userId,
          fullName: payload.fullName.trim() || payload.email?.trim() || 'Autofix Customer',
          phone: 'Pending',
          email: payload.email?.trim() || null,
          notes: 'Auto-created from booking flow.',
        },
        accessToken,
      )
    } catch (createError) {
      const isConflict = createError instanceof BookingApiError && createError.statusCode === 409
      if (!isConflict) {
        throw createError
      }

      return getCurrentCustomerRequest(payload.userId, accessToken)
    }
  }
}

export function getVehiclesRequest(
  options: {
    ownerCustomerId: string
    vin?: string
    page?: number
    pageSize?: number
  },
  accessToken?: string,
) {
  const params = new URLSearchParams()
  params.set('ownerCustomerId', options.ownerCustomerId)
  params.set('page', String(options.page ?? 1))
  params.set('pageSize', String(options.pageSize ?? 50))

  if (options.vin?.trim()) {
    params.set('vin', options.vin.trim())
  }

  return request<PagedResult<VehicleDto>>(`/Vehicles?${params.toString()}`, { method: 'GET' }, accessToken)
}

export function decodeVinRequest(vin: string, accessToken?: string) {
  return request<VinDecodeResultDto>(
    '/Vehicles/decode-vin',
    {
      method: 'POST',
      body: JSON.stringify({ vin }),
    },
    accessToken,
  )
}

export function createVehicleRequest(payload: CreateVehiclePayload, accessToken?: string) {
  return request<VehicleDto>(
    '/Vehicles',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export function getBookingQuoteRequest(payload: BookingQuotePayload, accessToken?: string) {
  return request<BookingQuoteDto>(
    '/Bookings/quote',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export function createBookingRequest(payload: CreateBookingPayload, accessToken?: string) {
  return request<BookingDto>(
    '/Bookings',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export function approveBookingEstimateRequest(id: string, accessToken?: string) {
  return request<BookingDto>(
    `/Bookings/${id}/approve-estimate`,
    {
      method: 'POST',
    },
    accessToken,
  )
}

export function requestBookingChangesRequest(id: string, accessToken?: string) {
  return request<BookingDto>(
    `/Bookings/${id}/request-changes`,
    {
      method: 'POST',
    },
    accessToken,
  )
}

export function updateBookingPaymentOptionRequest(
  payload: {
    id: string
    paymentOption: 0 | 1
  },
  accessToken?: string,
) {
  return request<BookingDto>(
    `/Bookings/${payload.id}/payment-option`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export function updateBookingServiceOrderStatusRequest(
  payload: {
    id: string
    status: 7 | 3 | 4 | 6
  },
  accessToken?: string,
) {
  return request<BookingDto>(
    `/Bookings/${payload.id}/service-order-status`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    accessToken,
  )
}

export function getBookingByIdRequest(id: string, accessToken?: string) {
  return request<BookingDto>(`/Bookings/${id}`, { method: 'GET' }, accessToken)
}

export function getBookingsRequest(
  options: {
    customerId?: string
    vehicleId?: string
  } = {},
  accessToken?: string,
) {
  const params = new URLSearchParams()

  if (options.customerId?.trim()) {
    params.set('customerId', options.customerId.trim())
  }

  if (options.vehicleId?.trim()) {
    params.set('vehicleId', options.vehicleId.trim())
  }

  const suffix = params.size > 0 ? `?${params.toString()}` : ''
  return request<BookingDto[]>(`/Bookings${suffix}`, { method: 'GET', cache: 'no-store' }, accessToken)
}

export function getMyBookingsRequest(accessToken?: string) {
  return request<BookingDto[]>('/Bookings/my', { method: 'GET', cache: 'no-store' }, accessToken)
}
