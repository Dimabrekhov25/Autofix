export interface ServiceDetailFeature {
  title: string
  description: string
  icon: string
}

export interface ServiceTrustBadge {
  label: string
  icon: string
}

export interface RelatedServiceCard {
  title: string
  description: string
  icon: string
  to: string
}

export interface PremiumOilChangeContent {
  breadcrumbLabel: string
  currentPageLabel: string
  title: string
  description: string
  image: {
    src: string
    alt: string
  }
  includedTitle: string
  includedItems: ServiceDetailFeature[]
  serviceRecordNote: string
  estimatedPriceLabel: string
  estimatedPriceValue: string
  durationLabel: string
  durationValue: string
  ctaLabel: string
  ctaTo: string
  disclaimer: string
  trustBadges: ServiceTrustBadge[]
  complementaryTitle: string
  complementaryServices: RelatedServiceCard[]
}
