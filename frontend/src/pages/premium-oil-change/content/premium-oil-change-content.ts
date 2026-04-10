import { APP_ROUTES, HOME_SECTION_ROUTES } from '../../../shared/config/routes'
import type { PremiumOilChangeContent } from '../types/premium-oil-change'

export const premiumOilChangeContent: PremiumOilChangeContent = {
  breadcrumbLabel: 'Services',
  currentPageLabel: 'Premium Oil Change',
  title: 'Premium Oil Change',
  description:
    'Keep your engine running at peak performance with our full synthetic oil service.',
  image: {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPAY3DJfv5QgV74iNLJIYqZHcHeTiqqjklX25YAXfkweH84qLbMZ3-H08HWMxn9DObaRMmJne7K6zhOV_Lg9u12qc1eHqsvS5hlJBcCgAD46xF-1_gXpeVOQa2EJ4UqH4fei55m5t4wrHL20GS74cXf4lMHShLmnlyjm73K5PCd-H_1QGd52yWc5h-19i8KSKzHRYjwCXk0I47Zy89NZzAq-2xpe5rXfc8U2QL2zXGkz9BFQ0eKcdDzXNB-ZVL_jYzJaZCNcwnvZOE',
    alt: 'Close-up of a high-performance car engine with premium oil service in a clean atelier.',
  },
  includedTitle: "What's Included",
  includedItems: [
    {
      title: 'Up to 5 quarts of full synthetic oil',
      description: 'Maximum engine protection and longevity for modern performance vehicles.',
      icon: 'oil_barrel',
    },
    {
      title: 'New premium oil filter',
      description: 'High-efficiency filtration to support clean circulation between service intervals.',
      icon: 'filter_alt',
    },
    {
      title: 'Fluid level check and top-off',
      description: 'Coolant, brake, and washer fluids reviewed during the visit.',
      icon: 'opacity',
    },
    {
      title: '21-point safety inspection',
      description: 'Vital wear items and essential systems checked before handoff.',
      icon: 'verified',
    },
  ],
  serviceRecordNote: 'Digital service record included for all customers.',
  estimatedPriceLabel: 'Estimated Price',
  estimatedPriceValue: 'From $89.00',
  durationLabel: 'Duration',
  durationValue: 'Approx. 45 mins',
  ctaLabel: 'Book This Service',
  ctaTo: APP_ROUTES.bookingEntry,
  disclaimer:
    'Price may vary based on vehicle make and model. Specific oil requirements may incur additional charges.',
  trustBadges: [
    { label: 'ASE Certified', icon: 'award_star' },
    { label: 'Warranty Backed', icon: 'verified_user' },
  ],
  complementaryTitle: 'Complementary Services',
  complementaryServices: [
    {
      title: 'Tire Rotation',
      description: 'Extend tire life with a precision rotation service matched to your wear pattern.',
      icon: 'tire_repair',
      to: HOME_SECTION_ROUTES.services,
    },
    {
      title: 'Cabin Filter',
      description: 'Restore interior air quality with a premium carbon filter replacement.',
      icon: 'air',
      to: HOME_SECTION_ROUTES.services,
    },
    {
      title: 'Battery Test',
      description: 'Run a full starting-system diagnostic before seasonal temperature changes.',
      icon: 'battery_charging_full',
      to: HOME_SECTION_ROUTES.services,
    },
  ],
}
