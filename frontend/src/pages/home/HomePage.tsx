import { SECTION_IDS } from '../../shared/config/routes'
import { SiteFooter } from '../../widgets/site-footer/SiteFooter'
import { SiteHeader } from '../../widgets/site-header/SiteHeader'
import { homePageContent } from './content/home-content'
import { CtaSection } from './sections/CtaSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { HeroSection } from './sections/HeroSection'
import { ServicesSection } from './sections/ServicesSection'
import { TestimonialsSection } from './sections/TestimonialsSection'
import { TrustBar } from './sections/TrustBar'
import { WorkflowSection } from './sections/WorkflowSection'

export function HomePage() {
  const content = homePageContent

  return (
    <div className="min-h-screen">
      <div id={SECTION_IDS.top} className="section-anchor" />
      <SiteHeader />
      <main className="overflow-hidden pt-20">
        <HeroSection content={content.hero} />
        <TrustBar content={content.trustBar} />
        <FeaturesSection id={SECTION_IDS.features} content={content.features} />
        <WorkflowSection id={SECTION_IDS.workflow} content={content.workflow} />
        <ServicesSection id={SECTION_IDS.services} content={content.services} />
        <TestimonialsSection id={SECTION_IDS.testimonials} content={content.testimonials} />
        <CtaSection id={SECTION_IDS.booking} content={content.cta} />
      </main>
      <div id={SECTION_IDS.footer} className="section-anchor" />
      <SiteFooter />
    </div>
  )
}
