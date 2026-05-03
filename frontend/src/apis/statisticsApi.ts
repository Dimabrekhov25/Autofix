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

// DTOs
export interface RevenueStatisticsDto {
  totalRevenue: number
  totalLaborCost: number
  totalPartsCost: number
  averageOrderValue: number
  completedOrders: number
  revenueTrend: number
}

export interface OrderStatisticsDto {
  totalOrders: number
  pendingOrders: number
  approvedOrders: number
  inProgressOrders: number
  completedOrders: number
  cancelledOrders: number
  averageProcessingTimeHours: number
  completionRate: number
}

export interface ServiceStatisticItemDto {
  serviceId: string
  serviceName: string
  timesRequested: number
  totalRevenue: number
  averagePrice: number
}

export interface ServiceStatisticsDto {
  totalUniqueServices: number
  servicesRequested: number
  topServices: ServiceStatisticItemDto[]
}

export interface InventoryStatisticItemDto {
  partId: string
  partName: string
  quantityOnHand: number
  reservedQuantity: number
  minLevel: number
  isBelowMinimum: boolean
}

export interface InventoryStatisticsDto {
  totalParts: number
  partsInStock: number
  partsBelowMinimum: number
  totalInventoryValue: number
  lowStockParts: InventoryStatisticItemDto[]
}

export interface CustomerStatisticsDto {
  totalCustomers: number
  activeCustomers: number
  newCustomersThisMonth: number
  customerRetentionRate: number
  averageCustomerLifetimeValue: number
  totalBookings: number
  averageBookingValue: number
}

export interface EmployeeStatisticItemDto {
  employeeId: string
  employeeName: string
  completedJobs: number
  totalLaborHours: number
  averageJobsPerDay: number
  averageJobValue: number
}

export interface EmployeeStatisticsDto {
  totalEmployees: number
  activeEmployees: number
  totalJobsCompleted: number
  averageJobsPerEmployee: number
  totalTeamLaborHours: number
  topPerformers: EmployeeStatisticItemDto[]
}

export interface ComprehensiveStatisticsDto {
  generatedAt: string
  revenue: RevenueStatisticsDto
  orders: OrderStatisticsDto
  services: ServiceStatisticsDto
  inventory: InventoryStatisticsDto
  customers: CustomerStatisticsDto
  employees: EmployeeStatisticsDto
}

const STATISTICS_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '')

export class StatisticsApiError extends Error {
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
    this.name = 'StatisticsApiError'
    this.code = options.code
    this.statusCode = options.statusCode
    this.validationErrors = options.validationErrors
    this.details = options.details
  }
}

function createEndpointUrl(path: string) {
  return `${STATISTICS_API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
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
    throw new StatisticsApiError('The server returned an unreadable response.', {
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
    throw new StatisticsApiError(
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

export function getStatisticsErrorMessage(
  error: unknown,
  fallbackMessage = 'Unable to load statistics.',
) {
  if (error instanceof StatisticsApiError) {
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

export async function getComprehensiveStatisticsRequest(accessToken: string): Promise<ComprehensiveStatisticsDto> {
  return request<ComprehensiveStatisticsDto>(
    '/statistics/comprehensive',
    {
      method: 'GET',
    },
    accessToken,
  )
}
