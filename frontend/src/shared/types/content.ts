export type ActionTone = 'primary' | 'secondary' | 'inverse' | 'ghost'

export type IconName =
  | 'calendar'
  | 'diagnostics'
  | 'inventory'
  | 'payments'
  | 'tracking'
  | 'history'
  | 'phone'
  | 'location'
  | 'clock'
  | 'star'
  | 'chevronLeft'
  | 'chevronRight'
  | 'quote'
  | 'arrowRight'
  | 'facebook'
  | 'share'

export interface ImageAsset {
  src: string
  alt: string
}

export interface LinkAction {
  label: string
  to: string
  tone?: ActionTone
}

export interface NavItem {
  label: string
  to: string
  matchPaths?: string[]
  matchHashes?: string[]
}

export interface HeroSegment {
  text: string
  highlight?: boolean
  breakAfter?: boolean
}

export interface HeroContent {
  eyebrow: string
  segments: HeroSegment[]
  description: string
  actions: LinkAction[]
  backgroundImage: ImageAsset
}

export interface TrustMetric {
  label: string
  value: string
  icon: IconName
}

export interface RatingSummary {
  value: string
  label: string
  avatars: ImageAsset[]
}

export interface FeatureCardContent {
  title: string
  description: string
  icon: IconName
}

export interface WorkflowStepContent {
  number: string
  title: string
  description: string
  emphasized?: boolean
}

export interface ServiceCardContent {
  title: string
  image: ImageAsset
  wide?: boolean
}

export interface TestimonialContent {
  quote: string
  author: string
  role: string
  avatar: ImageAsset
  rating: number
  featured?: boolean
}

export interface FooterLink {
  label: string
  to: string
}

export interface FooterColumnContent {
  title: string
  links: FooterLink[]
}

export interface SocialLink extends FooterLink {
  icon: IconName
}

export interface HomePageContent {
  hero: HeroContent
  trustBar: {
    metrics: TrustMetric[]
    rating: RatingSummary
  }
  features: {
    title: string
    description: string
    items: FeatureCardContent[]
  }
  workflow: {
    eyebrow: string
    title: string
    steps: WorkflowStepContent[]
  }
  services: {
    title: string
    description: string
    action: LinkAction
    items: ServiceCardContent[]
  }
  testimonials: {
    title: string
    description: string
    items: TestimonialContent[]
  }
  cta: {
    title: string
    description: string
    action: LinkAction
    highlights: string[]
    backgroundImage: ImageAsset
  }
}
