import { useTranslation } from 'react-i18next'

import { isAdminUser } from '../../features/auth/auth-types'
import { useAuth } from '../../features/auth/useAuth'
import { ServiceCatalogAdminView } from '../../features/services/components/ServiceCatalogAdminView'
import { ServiceCatalogCustomerView } from '../../features/services/components/ServiceCatalogCustomerView'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

export function ServicesPage() {
  const { t } = useTranslation()
  const { tokens, user } = useAuth()
  const accessToken = tokens?.accessToken
  const isAdmin = isAdminUser(user)

  return (
    <DashboardShell searchPlaceholder={t('servicesPage.searchPlaceholder')}>
      <section className="relative overflow-hidden pb-12 pt-2">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute left-0 top-40 h-80 w-80 rounded-full bg-amber-500/10 blur-[120px]" />

        <div className="relative">
          <div className="mb-10 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(24rem,0.85fr)]">
            <article className="rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-card sm:px-10">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[0.6875rem] font-black uppercase tracking-[0.24em] text-cyan-200">
                {t('servicesPage.eyebrow')}
              </span>
              <h1 className="mt-5 max-w-3xl font-headline text-4xl font-extrabold tracking-tight sm:text-5xl">
                {t('servicesPage.title')}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                {t('servicesPage.description')}
              </p>
            </article>

            <article className="rounded-[2rem] bg-white/90 p-8 shadow-panel backdrop-blur">
              <p className="text-[0.6875rem] font-black uppercase tracking-[0.22em] text-slate-400">
                {t('servicesPage.workflowTitle')}
              </p>
              <div className="mt-5 space-y-4">
                {[
                  t('servicesPage.workflow.0'),
                  t('servicesPage.workflow.1'),
                  t('servicesPage.workflow.2'),
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-base">check</span>
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {isAdmin ? (
            <ServiceCatalogAdminView accessToken={accessToken} />
          ) : (
            <ServiceCatalogCustomerView accessToken={accessToken} />
          )}
        </div>
      </section>
    </DashboardShell>
  )
}
