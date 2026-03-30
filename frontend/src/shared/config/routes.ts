export const SECTION_IDS = {
  top: 'top',
  features: 'features',
  workflow: 'workflow',
  services: 'services',
  testimonials: 'testimonials',
  booking: 'booking',
  footer: 'footer',
} as const

export const APP_ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  inventory: '/inventory',
  booking: '/booking',
  bookingSchedule: '/booking/schedule',
  bookingVehicle: '/booking/vehicle',
  bookingSummary: '/booking/summary',
  diagnostics: '/diagnostics',
  premiumOilChange: '/services/premium-oil-change',
  services: '/services',
  login: '/login',
  register: '/register',
  bookingEntry: '/start-booking',
} as const

export const HOME_SECTION_ROUTES = {
  home: `/#${SECTION_IDS.top}`,
  features: `/#${SECTION_IDS.features}`,
  workflow: `/#${SECTION_IDS.workflow}`,
  services: `/#${SECTION_IDS.services}`,
  testimonials: `/#${SECTION_IDS.testimonials}`,
  contact: `/#${SECTION_IDS.footer}`,
  login: APP_ROUTES.login,
  register: APP_ROUTES.register,
} as const

export const SUPPORT_ROUTES = {
  privacy: HOME_SECTION_ROUTES.contact,
  terms: HOME_SECTION_ROUTES.contact,
  support: HOME_SECTION_ROUTES.contact,
} as const

export function resolveProtectedEntryRoute(isAuthenticated: boolean) {
  return isAuthenticated ? APP_ROUTES.booking : APP_ROUTES.login
}
