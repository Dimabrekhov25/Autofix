import { Container } from '../../shared/ui/Container'
import { SiteFooter } from '../../widgets/site-footer/SiteFooter'
import { SiteHeader } from '../../widgets/site-header/SiteHeader'
import { premiumOilChangeContent } from './content/premium-oil-change-content'
import { ComplementaryServicesSection } from './sections/ComplementaryServicesSection'
import { ServiceBreadcrumb } from './sections/ServiceBreadcrumb'
import { ServiceDetailOverviewSection } from './sections/ServiceDetailOverviewSection'

export function PremiumOilChangePage() {
  const content = premiumOilChangeContent

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="pt-28">
        <Container className="pb-20">
          <ServiceBreadcrumb
            label={content.breadcrumbLabel}
            currentPage={content.currentPageLabel}
          />
          <ServiceDetailOverviewSection content={content} />
          <ComplementaryServicesSection
            title={content.complementaryTitle}
            items={content.complementaryServices}
          />
        </Container>
      </main>
      <SiteFooter />
    </div>
  )
}
