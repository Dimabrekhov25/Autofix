import {
  APP_ROUTES,
  HOME_SECTION_ROUTES,
  SUPPORT_ROUTES,
} from './routes'
import type {
  FooterColumnContent,
  FooterLink,
  NavItem,
  SocialLink,
} from '../types/content'

export const siteNavigation: NavItem[] = [
  {
    label: 'Home',
    to: HOME_SECTION_ROUTES.home,
    matchPaths: [APP_ROUTES.home],
    matchHashes: ['', '#top'],
  },
  {
    label: 'Services',
    to: HOME_SECTION_ROUTES.services,
    matchPaths: [APP_ROUTES.home],
    matchHashes: ['#services'],
  },
  {
    label: 'Workflow',
    to: HOME_SECTION_ROUTES.workflow,
    matchPaths: [APP_ROUTES.home],
    matchHashes: ['#workflow'],
  },
  { label: 'Register', to: APP_ROUTES.register, matchPaths: [APP_ROUTES.register] },
]

export const siteFooterColumns: FooterColumnContent[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Booking System', to: APP_ROUTES.bookingEntry },
      { label: 'Diagnostic Portal', to: HOME_SECTION_ROUTES.features },
      { label: 'Fleet Solutions', to: HOME_SECTION_ROUTES.testimonials },
      { label: 'Service History', to: HOME_SECTION_ROUTES.workflow },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Privacy Policy', to: SUPPORT_ROUTES.privacy },
      { label: 'Terms of Service', to: SUPPORT_ROUTES.terms },
      { label: 'Support', to: SUPPORT_ROUTES.support },
      { label: 'Register', to: APP_ROUTES.register },
    ],
  },
]

export const siteSocialLinks: SocialLink[] = [
  { label: 'Facebook', to: HOME_SECTION_ROUTES.contact, icon: 'facebook' },
  { label: 'Share', to: HOME_SECTION_ROUTES.contact, icon: 'share' },
]

export const siteFooterBottomLinks: FooterLink[] = [
  { label: 'Cookie Policy', to: SUPPORT_ROUTES.privacy },
  { label: 'Legal', to: SUPPORT_ROUTES.terms },
  { label: 'Support', to: SUPPORT_ROUTES.support },
]
